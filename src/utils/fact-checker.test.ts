import test from 'node:test';
import assert from 'node:assert/strict';
import { PRESET_CLAIMS, analyzeClaim } from './fact-checker';

test('Preset claims contain complete 4-stage evolution timelines and trusted sources', () => {
  assert.ok(PRESET_CLAIMS.length >= 3);

  for (const claim of PRESET_CLAIMS) {
    assert.ok(claim.claimHeadline.length > 0);
    assert.ok(claim.credibilityScore >= 0 && claim.credibilityScore <= 100);
    assert.ok(claim.evidenceSources.length >= 3);
    assert.equal(claim.evolutionTimeline.length, 4);

    // Verify evolution stages sequence 1 -> 2 -> 3 -> 4
    assert.equal(claim.evolutionTimeline[0].badgeLabel, 'Original Information');
    assert.equal(claim.evolutionTimeline[1].badgeLabel, 'Context Removal');
    assert.equal(claim.evolutionTimeline[2].badgeLabel, 'Misinterpretation');
    assert.equal(claim.evolutionTimeline[3].badgeLabel, 'Viral Distortion');

    // Verify trusted sources contain valid URL strings
    for (const src of claim.evidenceSources) {
      assert.ok(src.sourceUrl.startsWith('http'));
      assert.ok(src.credibilityRating > 80);
    }
  }
});

test('analyzeClaim matches keywords accurately and provides demonstration fallback for novel claims', () => {
  const result5G = analyzeClaim('Does 5G towers absorb human oxygen?');
  assert.equal(result5G.id, 'claim_5g_health_respiratory');
  assert.equal(result5G.claimStatus, 'False');

  const resultRupee = analyzeClaim('Will RBI deduct 18% GST tax from bank accounts over 1 lakh?');
  assert.equal(resultRupee.id, 'claim_rbi_digital_rupee_tax');
  assert.equal(resultRupee.claimStatus, 'False');

  const resultCustom = analyzeClaim('Drinking hot lemon water cures stage 4 cancer in 24 hours');
  assert.ok(resultCustom.id.startsWith('custom_claim_'));
  assert.equal(resultCustom.claimCategory, 'Public Health');
  assert.equal(resultCustom.isSimulatedDemonstration, true);
  assert.equal(resultCustom.evolutionTimeline.length, 4);
});
