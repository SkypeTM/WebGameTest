"use client";

import { useId } from "react";
import {
  activeMastery,
  formatSkillBonuses,
  getSpecialization,
  masteries,
  specializations,
  type MasteryId,
  type SkillTreeMember,
  type SpecializationId,
} from "../../lib/skill-tree";
import styles from "./CharacterSkillTree.module.css";

export type CharacterSkillTreeProps = {
  member: SkillTreeMember;
  characterName?: string;
  /** Read-only by default. Editing also requires the corresponding callback. */
  editable?: boolean;
  /** Existing game control / request lock; the server remains authoritative. */
  locked?: boolean;
  onSpecialize?: (choice: SpecializationId) => void;
  onMaster?: (choice: MasteryId) => void;
};

export default function CharacterSkillTree({
  member,
  characterName = "동료",
  editable = false,
  locked = false,
  onSpecialize,
  onMaster,
}: CharacterSkillTreeProps) {
  const headingId = useId();
  const noteId = useId();
  const chosenBranch = getSpecialization(member.specialization);
  const currentBranch = chosenBranch && member.level >= chosenBranch.minLevel ? chosenBranch : undefined;
  const currentMastery = activeMastery(member);
  const canEditBranches = editable && Boolean(onSpecialize);
  const canEditMasteries = editable && Boolean(onMaster);

  return <section className={styles.tree} aria-labelledby={headingId} aria-describedby={noteId}>
    <header className={styles.heading}>
      <div><span className={styles.eyebrow}>성장 경로</span><h3 id={headingId}>{characterName}의 전문화</h3></div>
      <span className={styles.level}>Lv.{member.level}</span>
    </header>
    <p className={styles.summary}>
      {currentBranch ? <><strong>{currentBranch.name}</strong><span aria-hidden="true"> → </span>{currentMastery ? <strong>{currentMastery.name}</strong> : <span>심화 미선택</span>}</> : "아직 전문화를 선택하지 않았습니다."}
    </p>
    <p id={noteId} className={styles.note}>Lv.3 전문화 1개 → Lv.7 심화 1개를 선택합니다. 거점 훈련장에서 무료로 변경할 수 있습니다.</p>
    {editable && <p className={styles.changeNotice}>전문화를 바꾸면 심화 선택이 해제됩니다. 새 전문화에 맞는 심화를 다시 골라 주세요.</p>}

    <ol className={styles.branches} aria-label="전문화별 성장 분기">
      {specializations.map(branch => {
        const branchSelected = currentBranch?.id === branch.id;
        const branchLevelLocked = member.level < branch.minLevel;
        const branchStatus = branchSelected ? "선택 중" : branchLevelLocked ? `Lv.${branch.minLevel}에 해금` : locked && canEditBranches ? "지금은 변경할 수 없음" : canEditBranches ? "선택 가능" : "훈련장에서 선택";
        const branchContent = <>
          <span className={styles.nodeLevel}>Lv.{branch.minLevel} · 전문화</span>
          <strong className={styles.nodeName}>{branch.name}</strong>
          <span className={styles.bonuses}>{formatSkillBonuses(branch.bonuses)}</span>
          <span className={styles.description}>{branch.description}</span>
          <span className={`${styles.nodeStatus} ${branchSelected ? styles.activeStatus : ""}`}>{branchSelected && <span aria-hidden="true">✓ </span>}{branchStatus}</span>
        </>;
        return <li key={branch.id} className={`${styles.branch} ${branchSelected ? styles.selectedBranch : ""}`}>
          {canEditBranches ? <button type="button" className={`${styles.node} ${branchSelected ? styles.selectedNode : ""}`}
            aria-label={`${branch.name} 전문화 선택 · ${formatSkillBonuses(branch.bonuses)} · ${branchStatus}`}
            aria-pressed={branchSelected} disabled={locked || branchLevelLocked || branchSelected}
            onClick={()=>onSpecialize?.(branch.id)}>{branchContent}</button>
            : <div className={`${styles.node} ${branchSelected ? styles.selectedNode : ""}`}>{branchContent}</div>}
          <div className={styles.connector} aria-hidden="true"><span>↓</span></div>
          <ol className={styles.masteries} aria-label={`${branch.name} 심화 · 두 가지 중 하나 선택`}>
            {masteries.filter(node => node.parent === branch.id).map(node => {
              const selected = currentMastery?.id === node.id;
              const levelLocked = member.level < node.minLevel;
              const prerequisiteLocked = !branchSelected;
              const status = selected ? "적용 중" : levelLocked ? `Lv.${node.minLevel}에 해금` : prerequisiteLocked ? `먼저 ${branch.name} 선택` : locked && canEditMasteries ? "지금은 변경할 수 없음" : canEditMasteries ? "선택 가능" : "훈련장에서 선택";
              const content = <>
                <span className={styles.nodeLevel}>Lv.{node.minLevel} · 심화</span>
                <strong className={styles.nodeName}>{node.name}</strong>
                <span className={styles.bonuses}>{formatSkillBonuses(node.bonuses)}</span>
                <span className={styles.description}>{node.description}</span>
                <span className={`${styles.nodeStatus} ${selected ? styles.activeStatus : ""}`}>{selected && <span aria-hidden="true">✓ </span>}{status}</span>
              </>;
              return <li key={node.id}>
                {canEditMasteries ? <button type="button" className={`${styles.node} ${selected ? styles.selectedNode : ""}`}
                  aria-label={`${branch.name} · ${node.name} 심화 선택 · ${formatSkillBonuses(node.bonuses)} · ${status}`}
                  aria-pressed={selected} disabled={locked || levelLocked || prerequisiteLocked || selected}
                  onClick={()=>onMaster?.(node.id)}>{content}</button>
                  : <div className={`${styles.node} ${selected ? styles.selectedNode : ""}`}>{content}</div>}
              </li>;
            })}
          </ol>
        </li>;
      })}
    </ol>
    <p className={styles.footerNote}>심화 효과는 선택한 전문화에 더해집니다. 레벨별 카드 해금과 승급 효과는 그대로 유지됩니다.</p>
  </section>;
}
