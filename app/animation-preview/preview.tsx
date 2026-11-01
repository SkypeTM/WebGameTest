'use client';
import { useEffect, useState } from 'react';
import FullBodyActor from '../components/FullBodyActor';
import FrameSampler from './FrameSampler';
import characters from '../../data/characters.json';
import sdAssets from '../../data/sd_asset_manifest.json';
import poses from '../../data/renewal_actor_manifest.json';
import '../renewal-combat.css';
import './preview.css';
import '../art-direction.css';

type View = 'sd' | 'full';
type AssetLoad = { key: string; status: 'loading' | 'ready' | 'error' };
const labels: Record<string, string> = { ready: '대기', windup: '공격 준비', swing: '중간 동작', strike: '타격', recover: '회수', hit: '피격', guard: '방패 반격', heal: '응급 회복', skill: '전용 스킬' };
const roster = characters.flatMap(character => {
  const sd = sdAssets.find(asset => asset.type === 'characters' && asset.id === character.id);
  if (!sd) return [];
  const entries = poses.filter(pose => pose.id === character.id);
  // Only complete combat sets can enter FullBodyActor; never enlarge an SD fallback.
  const fullBodyReady = ['ready', 'windup', 'strike', 'recover', 'hit'].every(pose => entries.some(entry => entry.pose === pose))
    && entries.some(entry => ['guard', 'heal', 'skill'].includes(entry.pose));
  return [{ ...character, sd, entries, fullBodyReady }];
});
const factions = [...new Set(roster.map(character => character.faction))];
const fullBodyCount = roster.filter(character => character.fullBodyReady).length;

export default function Preview() {
  const [id, setId] = useState(roster[0]?.id ?? '');
  const [view, setView] = useState<View>('sd');
  const [motion, setMotion] = useState('motion-strike');
  const [frame, setFrame] = useState<string | null>(null);
  const [replay, setReplay] = useState(0);
  const [speed, setSpeed] = useState(1);
  const [loop, setLoop] = useState(false);
  const [assetLoad, setAssetLoad] = useState<AssetLoad>({ key: '', status: 'loading' });
  const [loadAttempt, setLoadAttempt] = useState(0);
  const hero = roster.find(character => character.id === id);
  const activeView = hero?.fullBodyReady ? view : 'sd';
  const loadKey = id + ':' + activeView + ':' + loadAttempt;
  const assetsReady = assetLoad.key === loadKey && assetLoad.status === 'ready';
  const loadError = assetLoad.key === loadKey && assetLoad.status === 'error';

  useEffect(() => {
    if (!hero) return;
    let active = true;
    setAssetLoad({ key: loadKey, status: 'loading' });
    const assets = activeView === 'full' ? hero.entries : [hero.sd];
    const images = assets.map(asset => {
      const image = new Image();
      image.src = asset.path;
      return image;
    });
    void Promise.allSettled(images.map(image => image.decode())).then(results => {
      if (!active) return;
      setAssetLoad({ key: loadKey, status: results.some(result => result.status === 'rejected') ? 'error' : 'ready' });
    });
    return () => { active = false; };
  }, [hero, activeView, loadKey]);

  useEffect(() => {
    if (activeView !== 'full' || !assetsReady || !loop || frame || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    const timer = window.setTimeout(() => setReplay(number => number + 1), 1200 / speed);
    return () => window.clearTimeout(timer);
  }, [loop, frame, speed, replay, id, motion, assetsReady, activeView]);

  function chooseCharacter(nextId: string) {
    const next = roster.find(character => character.id === nextId);
    if (!next) return;
    setId(nextId);
    if (!next.fullBodyReady) setView('sd');
    setFrame(null);
    setMotion('motion-strike');
    setReplay(number => number + 1);
  }

  function chooseView(nextView: View) {
    setView(nextView);
    setFrame(null);
    setReplay(number => number + 1);
  }

  function play(value: string) {
    setFrame(null);
    setMotion(value);
    setReplay(number => number + 1);
  }

  if (!hero) return <main className="actor-preview"><a href="/">게임으로</a><h1>캐릭터 원화 미리보기</h1><p>현재 표시할 원화가 없습니다.</p></main>;

  const index = roster.indexOf(hero);
  const previous = roster[(index + roster.length - 1) % roster.length];
  const next = roster[(index + 1) % roster.length];
  const selected = hero.entries.find(entry => entry.pose === frame);
  const skill = hero.entries.some(entry => entry.pose === 'guard') ? 'motion-guard'
    : hero.entries.some(entry => entry.pose === 'heal') ? 'motion-heal' : 'motion-strike motion-skill';
  const stageDescription = activeView === 'sd' ? 'SD 원화' : frame ? labels[frame] ?? frame : '전신 동작 재생';

  return <main className="actor-preview">
    <nav aria-label="페이지 이동"><a href="/roadmap">← 앞으로의 여정</a><a href="/">게임으로</a></nav>
    <header className="preview-heading">
      <p className="preview-eyebrow">CHARACTER GALLERY</p>
      <h1>캐릭터 원화 · 전투 연출</h1>
      <p>동료의 SD 원화와 준비된 전신 전투 자세를 살펴보세요. 게임 진행과 저장 데이터에는 영향을 주지 않습니다.</p>
      <div className="preview-availability"><span>SD 원화 {roster.length}명</span><span>전신 전투 {fullBodyCount}명</span></div>
    </header>

    <section className="preview-roster" aria-label="캐릭터 선택">
      <label className="preview-character-select" htmlFor="preview-character">캐릭터
        <select id="preview-character" value={id} onChange={event => chooseCharacter(event.target.value)}>
          {factions.map(faction => <optgroup key={faction} label={faction}>
            {roster.filter(character => character.faction === faction).map(character => <option key={character.id} value={character.id}>
              {character.name} · {character.role}{character.fullBodyReady ? ' · 전신 지원' : ' · SD'}
            </option>)}
          </optgroup>)}
        </select>
      </label>
      <div className="preview-roster-step">
        <button type="button" onClick={() => chooseCharacter(previous.id)} aria-label={'이전 캐릭터: ' + previous.name}>← 이전</button>
        <span aria-label={roster.length + '명 중 ' + (index + 1) + '번째'}>{index + 1} / {roster.length}</span>
        <button type="button" onClick={() => chooseCharacter(next.id)} aria-label={'다음 캐릭터: ' + next.name}>다음 →</button>
      </div>
    </section>

    <div className="preview-layout">
      <figure className="preview-figure">
        <div className={'preview-stage preview-stage-' + activeView} aria-label={hero.name + ' ' + stageDescription} aria-busy={!assetsReady && !loadError}
          onErrorCapture={() => setAssetLoad({ key: loadKey, status: 'error' })}>
          {!assetsReady ? <div className="preview-loading" role="status">
            <p>{loadError ? '원화를 불러오지 못했습니다.' : hero.name + '의 원화를 준비하고 있습니다.'}</p>
            {loadError && <button type="button" onClick={() => setLoadAttempt(number => number + 1)}>다시 불러오기</button>}
          </div> : activeView === 'sd' ? <img key={loadKey} src={hero.sd.path} width={hero.sd.width} height={hero.sd.height} alt={hero.name + ' · ' + hero.faction + ' · SD 원화'} draggable={false} />
            : selected ? <img key={loadKey + ':' + selected.pose} src={selected.path} width={selected.width} height={selected.height} alt={hero.name + ' · ' + (labels[selected.pose] ?? selected.pose)} draggable={false} />
              : <FullBodyActor key={id + '-' + replay + '-' + speed + '-' + loadAttempt} id={id} motion={motion} playbackRate={speed} />}
        </div>
        <figcaption className="preview-caption" aria-live="polite" aria-atomic="true">
          <div><strong>{hero.name}</strong><span>{hero.faction} · {hero.role}</span></div>
          <span className="preview-view-badge">{stageDescription}</span>
        </figcaption>
      </figure>

      <section className="preview-controls" aria-label="원화와 연출 조작">
        <h2>보기 방식</h2>
        <div className="preview-buttons preview-view-switch" role="group" aria-label="원화 보기 방식">
          <button type="button" aria-pressed={activeView === 'sd'} onClick={() => chooseView('sd')}>SD 원화</button>
          <button type="button" aria-pressed={activeView === 'full'} disabled={!hero.fullBodyReady} aria-describedby="preview-support-note" onClick={() => chooseView('full')}>전신 전투</button>
        </div>
        <p id="preview-support-note" className="preview-support-note">{hero.fullBodyReady
          ? '전신 ' + hero.entries.length + '개 자세가 준비되어 있습니다. 전신 전투에서 동작과 개별 자세를 확인하세요.'
          : '이 동료는 SD 원화를 볼 수 있습니다. 전신 전투 자세는 아직 준비 중입니다.'}</p>

        {activeView === 'full' && hero.fullBodyReady ? <>
          <h2>동작 재생</h2>
          <div className="preview-buttons">{[['motion-strike', '기본 공격'], ['motion-hit', '피격'], [skill, '전용 스킬']].map(([value, label]) => <button type="button" key={value} disabled={!assetsReady} aria-pressed={!frame && motion === value} onClick={() => play(value)}>{label}</button>)}</div>
          <button type="button" disabled={!assetsReady} onClick={() => play(motion)}>다시 재생</button>
          <label htmlFor="preview-speed">재생 속도<select id="preview-speed" value={speed} onChange={event => setSpeed(Number(event.target.value))}><option value={1}>1배속</option><option value={.5}>0.5배속</option><option value={.25}>0.25배속</option></select></label>
          <label className="preview-loop"><input type="checkbox" checked={loop} onChange={event => setLoop(event.target.checked)} /> 반복 재생</label>
          <h2>개별 자세</h2>
          <div className="preview-buttons">{hero.entries.map(entry => <button type="button" key={entry.pose} disabled={!assetsReady} aria-pressed={frame === entry.pose} onClick={() => setFrame(entry.pose)}>{labels[entry.pose] ?? entry.pose}</button>)}</div>
          <p>1배속 동작은 약 0.9초 후 대기로 돌아옵니다. 개별 자세 선택 시 반복은 멈춥니다. 운영체제의 동작 줄이기가 켜져 있으면 개별 자세로 확인하세요.</p>
          <small>현재는 자세 전환 방식입니다. 연속 리깅과 실제 전투 전체 검증은 진행 중입니다.</small>
          {assetsReady && <FrameSampler key={id} />}
        </> : <div className="preview-sd-note">
          <h2>동료 원화</h2>
          <p>헤어·의상·장비의 실루엣을 한눈에 볼 수 있는 SD 원화입니다. 위의 목록이나 이전·다음 버튼으로 다른 동료를 선택하세요.</p>
          <dl><div><dt>팩션</dt><dd>{hero.faction}</dd></div><div><dt>역할</dt><dd>{hero.role}</dd></div><div><dt>원화 종류</dt><dd>{hero.fullBodyReady ? 'SD · 전신 전투' : 'SD'}</dd></div></dl>
        </div>}
      </section>
    </div>
  </main>;
}
