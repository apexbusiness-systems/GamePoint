-- GamePoint seed: 16 grounded titles (contract v1.1 audit A3 — 4 PMF rows intentionally
-- absent pending the research report; see governance/compliance-matrix.md).
-- Idempotent: upsert on slug; re-run produces zero duplicate rows.

insert into public.titles
  (slug, display_name, publisher, anti_cheat_class, publisher_stance, wave, compliance_status, runtime_eligible, pvp_flagged, reviewed_at)
values
  ('path-of-exile-2','Path of Exile 2','Grinding Gear Games','server_side','Official public API; companion tools tolerated. Anti-cheat class is inference.',1,'cleared',true,false,'2026-07-08'),
  ('baldurs-gate-3','Baldur''s Gate 3','Larian Studios','none','Single-player/co-op; contract: cleared.',1,'cleared',true,false,'2026-07-08'),
  ('elden-ring-nightreign','Elden Ring / Nightreign','FromSoftware / Bandai Namco','eac_disableable','Overlay/guide tools widely tolerated; low-risk tier.',1,'cleared',true,false,'2026-07-08'),
  ('monster-hunter-wilds','Monster Hunter Wilds','Capcom','server_side','UNCERTAIN: no explicit stance located; Wave 1 per contract. Anti-cheat class is inference.',1,'cleared',true,false,'2026-07-08'),
  ('warframe','Warframe','Digital Extremes','server_side','Official Public Export endpoint; contract: cleared. Anti-cheat class is inference.',1,'cleared',true,false,'2026-07-08'),
  ('diablo-iv','Diablo IV','Blizzard Entertainment','server_side','Blizzard verify_terms (contract); runtime blocked until terms review (audit A4).',1,'verify_terms',false,false,'2026-07-08'),
  ('old-school-runescape','Old School RuneScape','Jagex','server_side','Wiki CC-BY-NC-SA: license blocks runtime packs.',2,'license_blocked',false,false,'2026-07-08'),
  ('minecraft','Minecraft','Mojang / Microsoft','none','Wiki licensing blocks commercial runtime use.',2,'license_blocked',false,false,'2026-07-08'),
  ('stardew-valley','Stardew Valley','ConcernedApe','none','Wiki licensing blocks commercial runtime use.',2,'license_blocked',false,false,'2026-07-08'),
  ('terraria','Terraria','Re-Logic','none','Contract: cleared (CC-BY-SA wiki). Registry only in v1.0.',2,'cleared',false,false,'2026-07-08'),
  ('league-of-legends','League of Legends','Riot Games','kernel','Overwolf-class coaching tolerated; Vanguard false-positive disclosure required; Riot terms: verify.',2,'verify_terms',false,true,'2026-07-08'),
  ('valorant','Valorant','Riot Games','kernel','Decision-support only; Advantage Check hardest here.',2,'verify_terms',false,true,'2026-07-08'),
  ('destiny-2','Destiny 2','Bungie','kernel','Bungie verify_terms (contract); adapter stubbed behind refusing flag. Anti-cheat class is inference.',2,'verify_terms',false,true,'2026-07-08'),
  ('call-of-duty-warzone','Call of Duty: Warzone / MW','Activision','kernel','Ricochet; aggressive enforcement; internal sign-off required.',2,'verify_terms',false,true,'2026-07-08'),
  ('grand-theft-auto-v','Grand Theft Auto V','Rockstar Games','server_side','Single-player scope only; GTA Online blocked pending dedicated review (skill §IV.A).',2,'legal_review',false,false,'2026-07-08'),
  ('grand-theft-auto-vi','Grand Theft Auto VI','Rockstar Games',null,'Unreleased (2026-11-19). Registry row only; no runtime support in v1.0.',3,'legal_review',false,false,'2026-07-08')
on conflict (slug) do update set
  display_name = excluded.display_name,
  publisher = excluded.publisher,
  anti_cheat_class = excluded.anti_cheat_class,
  publisher_stance = excluded.publisher_stance,
  wave = excluded.wave,
  compliance_status = excluded.compliance_status,
  runtime_eligible = excluded.runtime_eligible,
  pvp_flagged = excluded.pvp_flagged,
  reviewed_at = excluded.reviewed_at;

-- Wave-1 knowledge sources (official/cleared only; URLs are ingestion entry points).
insert into public.knowledge_sources (title_id, source_type, url, license, runtime_eligible, revalidation_due)
select t.id, s.source_type::source_type, s.url, s.license::source_license, s.runtime_eligible, date '2026-10-01'
from (values
  ('path-of-exile-2','official_api','https://www.pathofexile.com/developer/docs','official-API-terms',true),
  ('path-of-exile-2','patch_notes','https://www.pathofexile.com/forum/view-forum/patch-notes','proprietary',true),
  ('baldurs-gate-3','mediawiki_api','https://bg3.wiki/w/api.php','CC-BY-SA',true),
  ('baldurs-gate-3','patch_notes','https://baldursgate3.game/news','proprietary',true),
  ('elden-ring-nightreign','patch_notes','https://www.bandainamcoent.com/games/elden-ring','proprietary',true),
  ('monster-hunter-wilds','patch_notes','https://www.monsterhunter.com/wilds/en-us/update','proprietary',true),
  ('warframe','official_api','https://origin.warframe.com/PublicExport/index_en.txt.lzma','official-API-terms',true),
  ('warframe','mediawiki_api','https://wiki.warframe.com/api.php','CC-BY-SA',true),
  ('diablo-iv','patch_notes','https://news.blizzard.com/en-us/diablo4','proprietary',false),
  ('old-school-runescape','mediawiki_api','https://oldschool.runescape.wiki/api.php','CC-BY-NC-SA',false)
) as s(slug, source_type, url, license, runtime_eligible)
join public.titles t on t.slug = s.slug
on conflict (title_id, url) do update set
  license = excluded.license,
  runtime_eligible = excluded.runtime_eligible,
  revalidation_due = excluded.revalidation_due;
