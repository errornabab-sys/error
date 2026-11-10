import test from 'node:test';
import assert from 'node:assert/strict';
import {
  VERIFICATION_CONDITIONS,
  calculateAge,
  checkEligibility,
  generateZeroKnowledgeProof,
  verifyZkProof,
  modPow,
  modInverse,
  ZKP_PARAMS,
} from './crypto-zkp';

test('Math helpers: modPow and modInverse consistency', () => {
  const p = 1000000007n;
  const a = 1234567n;
  const inv = modInverse(a, p);
  assert.equal((a * inv) % p, 1n);

  const base = 5n;
  const exp = 3n;
  assert.equal(modPow(base, exp, 100n), 25n);
});

test('Age calculation correctly computes completed years', () => {
  const currentYear = new Date().getFullYear();
  const dob18 = `${currentYear - 25}-01-15`;
  const age = calculateAge(dob18);
  assert.ok(age >= 24 && age <= 26);

  const dobUnderage = `${currentYear - 10}-05-20`;
  assert.ok(calculateAge(dobUnderage) < 18);
});

test('Eligibility condition checking without leaking to proof', () => {
  const ageCond = VERIFICATION_CONDITIONS.find(c => c.id === 'AGE_18')!;
  const creditCond = VERIFICATION_CONDITIONS.find(c => c.id === 'CREDIT_700')!;

  const userEligible = {
    dob: '1995-04-12',
    income: 850000,
    balance: 250000,
    creditScore: 780,
  };

  const ageRes = checkEligibility(ageCond, userEligible);
  assert.equal(ageRes.isEligible, true);
  assert.ok(ageRes.privateValue >= 18);

  const creditRes = checkEligibility(creditCond, userEligible);
  assert.equal(creditRes.isEligible, true);
  assert.equal(creditRes.privateValue, 780);

  const userIneligible = {
    dob: '2015-01-01',
    income: 300000,
    balance: 40000,
    creditScore: 620,
  };

  const creditIneligible = checkEligibility(creditCond, userIneligible);
  assert.equal(creditIneligible.isEligible, false);
});

test('Zero-Knowledge Proof Generation and Mathematical Verification succeeds for valid condition', () => {
  const condition = VERIFICATION_CONDITIONS.find(c => c.id === 'CREDIT_700')!;
  const secretScore = 750; // satisfies >= 700

  // Generate ZKP prover-side
  const proof = generateZeroKnowledgeProof(condition, secretScore);

  assert.ok(proof.proofId.startsWith('zkp_credit_700_'));
  assert.equal(proof.conditionId, 'CREDIT_700');
  assert.equal(proof.threshold, 700);
  assert.ok(proof.commitment.startsWith('0x'));
  assert.ok(proof.announcement.startsWith('0x'));
  assert.ok(proof.challenge.startsWith('0x'));
  assert.ok(proof.responseDelta.startsWith('0x'));
  assert.ok(proof.responseBlinding.startsWith('0x'));

  // Ensure secretScore (750) is NEVER anywhere in the proof object
  const proofString = JSON.stringify(proof);
  assert.equal(proofString.includes('750'), false, 'Private score must NEVER be included in proof payload');

  // Verify on Verifier side
  const verification = verifyZkProof(proof);
  assert.equal(verification.isValid, true);
  assert.equal(verification.mathChecks.commitmentWellFormed, true);
  assert.equal(verification.mathChecks.challengeMatchesHash, true);
  assert.equal(verification.mathChecks.sigmaEquationSatisfied, true);
  assert.equal(verification.privacyAudit.privateDataTransmittedBytes, 0);
});

test('Zero-Knowledge Proof rejects tampered or fraudulent proofs', () => {
  const condition = VERIFICATION_CONDITIONS.find(c => c.id === 'BALANCE_1L')!;
  const proof = generateZeroKnowledgeProof(condition, 150000);

  // Verification succeeds on genuine proof
  assert.equal(verifyZkProof(proof).isValid, true);

  // Attack 1: Maliciously tamper with threshold (e.g. claim it was for 500,000 without prover witness)
  const tamperedThreshold = { ...proof, threshold: 500000 };
  const res1 = verifyZkProof(tamperedThreshold);
  assert.equal(res1.isValid, false, 'Tampered threshold must fail verification');

  // Attack 2: Tamper with commitment
  const tamperedCommitment = { ...proof, commitment: '0x' + (BigInt(proof.commitment) + 1n).toString(16) };
  const res2 = verifyZkProof(tamperedCommitment);
  assert.equal(res2.isValid, false, 'Tampered commitment must fail verification');

  // Attack 3: Ineligible generation must throw
  assert.throws(() => {
    generateZeroKnowledgeProof(condition, 50000); // 50,000 < 100,000
  });
});
