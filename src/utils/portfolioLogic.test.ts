import test from 'node:test';
import assert from 'node:assert/strict';
import {
  clampPanelDragOffset,
  computeChapterRevealState,
  computeHallwayScrollProgress,
  computeWorldCameraTargetZ,
  filterProjectsByCategory,
  filterSkillsByCategory,
  getAtmosphereTheme,
  getNextStationChapterId,
  getStationForChapter,
  shouldAutostartFromSearch,
  shouldStartPanelDrag,
  validateContactForm,
} from './portfolioLogic';
import { skillsData } from '../data/skills';
import { projectsData } from '../data/projects';

test('validateContactForm rejects empty or malformed inputs', () => {
  const result = validateContactForm({
    name: 'B',
    email: 'invalid-email',
    subject: 'Hi',
    message: 'Short',
  });

  assert.equal(result.valid, false);
  assert.ok(result.errors.name);
  assert.ok(result.errors.email);
  assert.ok(result.errors.subject);
  assert.ok(result.errors.message);
});

test('validateContactForm accepts complete valid letter', () => {
  const result = validateContactForm({
    name: 'Amina Deshmukh',
    email: 'amina@example.org',
    subject: 'Frontend Developer Role',
    message: 'Hello Basiturraza, we would love to discuss an engineering opportunity.',
  });

  assert.equal(result.valid, true);
  assert.deepEqual(result.errors, {});
});

test('filterSkillsByCategory returns expected subsets', () => {
  const all = filterSkillsByCategory(skillsData, 'All');
  assert.equal(all.length, skillsData.length);

  const dbs = filterSkillsByCategory(skillsData, 'Databases');
  assert.ok(dbs.length > 0);
  assert.ok(dbs.every((item) => item.category === 'Databases'));
});

test('filterProjectsByCategory filters accurately', () => {
  const all = filterProjectsByCategory(projectsData, 'All');
  assert.equal(all.length, projectsData.length);

  const interactive = filterProjectsByCategory(projectsData, '3D & Interactive');
  assert.ok(interactive.length >= 1);
  assert.ok(interactive.every((item) => item.category === '3D & Interactive'));
});

test('shouldAutostartFromSearch parses ?autostart=1', () => {
  assert.equal(shouldAutostartFromSearch('?autostart=1'), true);
  assert.equal(shouldAutostartFromSearch('?foo=bar&autostart=1'), true);
  assert.equal(shouldAutostartFromSearch('?autostart=0'), false);
  assert.equal(shouldAutostartFromSearch(''), false);
});

test('computeHallwayScrollProgress clamps between 0 and 1', () => {
  assert.equal(computeHallwayScrollProgress(0, 3000, 900), 0);
  assert.equal(computeHallwayScrollProgress(1050, 3000, 900), 0.5);
  assert.equal(computeHallwayScrollProgress(5000, 3000, 900), 1);
});

test('computeWorldCameraTargetZ maps intro and full-site scroll progress cleanly', () => {
  assert.equal(computeWorldCameraTargetZ(false, 0.5), 5.2);
  assert.equal(computeWorldCameraTargetZ(true, 0), -14);
  assert.equal(computeWorldCameraTargetZ(true, 0.5), -59);
  assert.equal(computeWorldCameraTargetZ(true, 1), -104);
  assert.equal(computeWorldCameraTargetZ(true, 2), -104);
});

test('atmosphere themes and chapter stations resolve accurately', () => {
  const moon = getAtmosphereTheme('moonlight');
  assert.equal(moon.id, 'moonlight');
  assert.ok(moon.bgHex.startsWith('#'));

  const sakura = getAtmosphereTheme('sakura');
  assert.equal(sakura.label, 'Sakura Dawn');

  const projectsStation = getStationForChapter('projects');
  assert.equal(projectsStation.id, 'projects');
  assert.equal(projectsStation.targetZ, -68);

  assert.equal(getNextStationChapterId('home', 1), 'about');
  assert.equal(getNextStationChapterId('home', -1), 'contact');
  assert.equal(getNextStationChapterId('contact', 1), 'home');
});

test('panel drag threshold and offset clamping keep clicks distinct from drags', () => {
  assert.equal(shouldStartPanelDrag(2, 3), false);
  assert.equal(shouldStartPanelDrag(7, 2), true);

  assert.deepEqual(clampPanelDragOffset(240, -180, 1200, 900), { x: 240, y: -180 });
  assert.deepEqual(clampPanelDragOffset(2500, -1800, 1200, 900), { x: 1200, y: -900 });
});

test('computeChapterRevealState drives smooth scroll entry, active reading, and exit fade', () => {
  // Before entering bottom of viewport
  const before = computeChapterRevealState(1120, 1800, 900);
  assert.equal(before.phase, 'before');
  assert.ok(before.opacity < 0.2);
  assert.ok(before.translateY > 25);
  assert.ok(before.scale < 1);

  // Centered in active reading zone
  const active = computeChapterRevealState(120, 740, 900);
  assert.equal(active.phase, 'active');
  assert.equal(active.opacity, 1);
  assert.equal(active.translateY, 0);
  assert.equal(active.scale, 1);

  // Scrolled past top of viewport
  const after = computeChapterRevealState(-900, -240, 900);
  assert.equal(after.phase, 'after');
  assert.ok(after.opacity < 0.2);
  assert.ok(after.translateY < -20);
  assert.ok(after.scale < 1);
});
