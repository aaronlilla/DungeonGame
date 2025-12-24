import { motion } from 'framer-motion';
import { useGameStore } from '../store/gameStore';
import { getClassById, getClassColor } from '../types/classes';
import { CharacterSelector } from './shared/CharacterSelector';
import { 
  getTalentTree, 
  countSelectedTalents,
  isTierUnlocked,
  type Talent,
  type TalentTierLevel,
  type TalentTier
} from '../types/talents';
import {
  // Tank/Defense icons - verified from codebase
  GiShieldBash, GiCastle, GiVibratingShield, GiShield, GiCheckedShield, 
  GiMagicShield, GiCrossedSwords, GiSwordClash, GiBoltShield, GiShieldReflect,
  // Combat/Offensive icons - verified from codebase
  GiFireball, GiLightningTear, GiDeathSkull, GiMeteorImpact, GiFire,
  GiBroadsword, GiSwordsEmblem, GiPunchBlast, GiSkullCrossedBones,
  GiLightningStorm, GiFlameSpin, GiLaserBurst, GiVortex,
  // Healer/Support icons - verified from codebase
  GiHealthPotion, GiLotusFlower, GiHolySymbol, GiAngelWings, GiHeartPlus,
  GiDrop, GiWaterDrop, GiMagicSwirl, GiSparkles, GiHealthNormal, GiHealthIncrease,
  // Misc icons - verified from codebase
  GiCrown, GiScrollUnfurled, GiFeather, GiGhost, GiPortal, GiBookmark,
  GiOakLeaf, GiPentacle, GiChessRook, GiStarFormation, GiMuscleUp,
  GiBrain, GiRunningNinja, GiTargetArrows, GiCog, GiMagicGate,
} from 'react-icons/gi';
import type { IconType } from 'react-icons';

// Comprehensive icon mapping for dynamic rendering
// Maps icon names to verified icons from the codebase
const ICON_MAP: Record<string, IconType> = {
  // Direct mappings - all verified from other files in codebase
  GiShieldBash, GiCastle, GiVibratingShield, GiShield, GiCheckedShield,
  GiMagicShield, GiCrossedSwords, GiSwordClash, GiBoltShield, GiShieldReflect,
  GiFireball, GiLightningTear, GiDeathSkull, GiMeteorImpact, GiFire,
  GiBroadsword, GiSwordsEmblem, GiPunchBlast, GiSkullCrossedBones,
  GiLightningStorm, GiFlameSpin, GiLaserBurst, GiVortex,
  GiHealthPotion, GiLotusFlower, GiHolySymbol, GiAngelWings, GiHeartPlus,
  GiDrop, GiWaterDrop, GiMagicSwirl, GiSparkles, GiHealthNormal, GiHealthIncrease,
  GiCrown, GiScrollUnfurled, GiFeather, GiGhost, GiPortal, GiBookmark,
  GiOakLeaf, GiPentacle, GiChessRook, GiStarFormation, GiMuscleUp,
  GiBrain, GiRunningNinja, GiTargetArrows, GiCog, GiMagicGate,
  
  // Legacy compatibility - map any old/missing names to valid icons
  GiChestArmor: GiShield,
  GiTemplarShield: GiShield,
  GiBrokenShield: GiShield,
  GiSkullShield: GiDeathSkull,
  GiHealingShield: GiShield,
  GiHeartShield: GiHeartPlus,
  GiShieldBounces: GiShield,
  GiShieldEchoes: GiMagicShield,
  GiRoundShield: GiShield,
  GiVikingShield: GiShield,
  GiLightningBolt: GiLightningTear,
  GiLightningArc: GiLightningTear,
  GiLightningTrio: GiLightningTear,
  GiMineExplosion: GiFireball,
  GiExplosion: GiFireball,
  GiExplosiveMeeting: GiFireball,
  GiBurningMeteor: GiMeteorImpact,
  GiFist: GiPunchBlast,
  GiSword: GiBroadsword,
  GiSwordWound: GiBroadsword,
  GiArrowDunk: GiBroadsword,
  GiCircleClaws: GiPunchBlast,
  GiAngelOutfit: GiAngelWings,
  GiSunbeams: GiSparkles,
  GiSunRadiations: GiSparkles,
  GiSun: GiSparkles,
  GiPrayerBeads: GiLotusFlower,
  GiLifeSupport: GiHeartPlus,
  GiSunflower: GiLotusFlower,
  GiStarSwirl: GiStarFormation,
  GiOak: GiOakLeaf,
  GiFlowerPot: GiLotusFlower,
  GiHeartBeats: GiHeartPlus,
  GiHeart: GiHeartPlus,
  GiHearts: GiHeartPlus,
  GiHolyGrail: GiHealthPotion,
  GiMagicPalm: GiMagicSwirl,
  GiAura: GiSparkles,
  GiMoon: GiPortal,
  GiEvilMoon: GiPortal,
  GiEye: GiBrain,
  GiEyeball: GiBrain,
  GiEyeOfHorus: GiBrain,
  GiTripleYin: GiVortex,
  GiDragonHead: GiDeathSkull,
  GiDragonSpiral: GiVortex,
  GiPhoenix: GiFlameSpin,
  GiFlame: GiFire,
  GiRaven: GiGhost,
  GiBat: GiGhost,
  GiSpiderWeb: GiVortex,
  GiSpiderFace: GiDeathSkull,
  GiVitruvianMan: GiMuscleUp,
  GiStrong: GiMuscleUp,
  GiBiceps: GiMuscleUp,
  GiMuscleFat: GiMuscleUp,
  GiCrystalShine: GiSparkles,
  GiMountain: GiChessRook,
  GiMountaintop: GiChessRook,
  GiLockedFortress: GiCastle,
  GiAnchor: GiShield,
  GiFootprint: GiRunningNinja,
  GiWalkingBoot: GiRunningNinja,
  GiTwoShadows: GiGhost,
  GiStonePile: GiChessRook,
  GiMountainRoad: GiChessRook,
  GiTowerFall: GiCastle,
  GiAnvil: GiCog,
  GiMeditation: GiLotusFlower,
  GiHealing: GiHealthPotion,
  GiSpellBook: GiBookmark,
  GiCrystalBall: GiPortal,
  GiGems: GiSparkles,
  GiDiamondHard: GiSparkles,
  GiSkull: GiDeathSkull,
};

function renderIcon(iconName: string, size: string = '1em', color?: string) {
  const Icon = ICON_MAP[iconName];
  if (!Icon) return null;
  return <Icon style={{ fontSize: size, color }} />;
}

// Ensure colors are bright enough for readability on dark backgrounds
function ensureReadableColor(hexColor: string, minBrightness: number = 120): string {
  // Parse hex color
  const hex = hexColor.replace('#', '');
  const r = parseInt(hex.substring(0, 2), 16);
  const g = parseInt(hex.substring(2, 4), 16);
  const b = parseInt(hex.substring(4, 6), 16);
  
  // Calculate perceived brightness
  const brightness = (r * 299 + g * 587 + b * 114) / 1000;
  
  if (brightness >= minBrightness) return hexColor;
  
  // Brighten the color
  const factor = minBrightness / Math.max(brightness, 1);
  const newR = Math.min(255, Math.round(r * factor + 40));
  const newG = Math.min(255, Math.round(g * factor + 40));
  const newB = Math.min(255, Math.round(b * factor + 40));
  
  return `#${newR.toString(16).padStart(2, '0')}${newG.toString(16).padStart(2, '0')}${newB.toString(16).padStart(2, '0')}`;
}

export function TalentsTab() {
  const { 
    team, 
    selectedCharacterId,
    selectCharacter,
    selectTalent,
    deselectTalent,
    resetTalents
  } = useGameStore();

  const selectedCharacter = team.find(c => c.id === selectedCharacterId);
  const classData = selectedCharacter?.classId ? getClassById(selectedCharacter.classId) : null;
  const classColors = selectedCharacter?.classId ? getClassColor(selectedCharacter.classId) : null;
  const rawPrimaryColor = classColors?.primary || '#c9a227';
  const rawSecondaryColor = classColors?.secondary || '#8b6914';
  // Ensure colors are readable on dark backgrounds
  const primaryColor = ensureReadableColor(rawPrimaryColor, 100);
  const secondaryColor = ensureReadableColor(rawSecondaryColor, 80);
  const talentTree = selectedCharacter?.classId ? getTalentTree(selectedCharacter.classId) : null;
  const selectedTalents = selectedCharacter?.selectedTalents || {};

  const handleTalentClick = (tierLevel: TalentTierLevel, talent: Talent) => {
    if (!selectedCharacter) return;
    
    // Check if tier is unlocked
    if (!isTierUnlocked(selectedCharacter.level, tierLevel)) {
      return; // Don't allow selection if level requirement not met
    }
    
    if (selectedTalents[tierLevel] === talent.id) {
      deselectTalent(selectedCharacter.id, tierLevel);
    } else {
      selectTalent(selectedCharacter.id, tierLevel, talent.id);
    }
  };

  const selectedCount = countSelectedTalents(selectedTalents);

  return (
    <div style={{ 
      display: 'grid', 
      gridTemplateColumns: '260px 1fr', 
      gap: '1rem',
      height: 'calc(100vh - 90px)',
      overflow: 'hidden',
      padding: '0.5rem 1rem'
    }}>
      {/* Character Selector */}
      <CharacterSelector
        team={team}
        selectedCharacterId={selectedCharacterId}
        onSelectCharacter={selectCharacter}
        getCharacterInfo={(char) => {
          const count = countSelectedTalents(char.selectedTalents || {});
          return `${count}/6 talents`;
        }}
      />

      {/* Talent Panel - Sharp styling */}
      <div style={{ 
        display: 'flex', 
        flexDirection: 'column', 
        height: '100%',
        background: `linear-gradient(180deg, rgba(20,18,14,0.98) 0%, rgba(12,10,8,0.99) 100%)`,
        borderRadius: '4px',
        border: `1px solid ${primaryColor}40`,
        boxShadow: `0 0 30px rgba(0,0,0,0.6), inset 0 1px 0 rgba(255,255,255,0.03)`,
        overflow: 'hidden',
      }}>
        {!selectedCharacter || !talentTree ? (
          <div style={{ 
            display: 'flex', 
            alignItems: 'center', 
            justifyContent: 'center', 
            height: '100%', 
            color: 'rgba(255,255,255,0.4)', 
            fontSize: '1rem',
          }}>
            {!selectedCharacter ? 'Select a character to view talents' : 'This character needs a class'}
          </div>
        ) : (
          <>
            {/* Compact Header - Sharp */}
            <div style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              padding: '0.6rem 1rem',
              background: `linear-gradient(90deg, ${primaryColor}15 0%, transparent 50%)`,
              borderBottom: `1px solid ${primaryColor}30`,
              flexShrink: 0,
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                <div style={{
                  width: '34px',
                  height: '34px',
                  borderRadius: '3px',
                  background: `linear-gradient(180deg, ${primaryColor}40 0%, ${secondaryColor}30 100%)`,
                  border: `1px solid ${primaryColor}`,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '1.1rem',
                  color: '#fff',
                }}>
                  {classData?.icon}
                </div>
                <div>
                  <div style={{ fontSize: '1.1rem', fontWeight: 700, color: '#fff' }}>
                    {talentTree.className} <span style={{ color: primaryColor }}>Talents</span>
                  </div>
                  <div style={{ fontSize: '0.75rem', color: 'rgba(255,255,255,0.5)' }}>
                    {selectedCount}/6 selected
                  </div>
                </div>
              </div>
              
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => selectedCharacter && resetTalents(selectedCharacter.id)}
                style={{
                  padding: '0.35rem 0.7rem',
                  background: 'rgba(160, 50, 50, 0.15)',
                  border: '1px solid rgba(160, 50, 50, 0.5)',
                  borderRadius: '2px',
                  color: '#c55',
                  fontSize: '0.7rem',
                  fontWeight: 600,
                  cursor: 'pointer',
                  textTransform: 'uppercase',
                  letterSpacing: '0.05em',
                }}
              >
                Reset
              </motion.button>
            </div>

            {/* Talent Rows - All equal height, no scroll */}
            <div style={{ 
              flex: 1,
              display: 'flex',
              flexDirection: 'column',
              padding: '0.5rem',
              gap: '0.4rem',
            }}>
              {talentTree.tiers.map((tier) => (
                <TalentRow
                  key={tier.level}
                  tier={tier}
                  selectedTalentId={selectedTalents[tier.level]}
                  primaryColor={primaryColor}
                  secondaryColor={secondaryColor}
                  onTalentClick={(talent) => handleTalentClick(tier.level, talent)}
                />
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
}

interface TalentRowProps {
  tier: TalentTier;
  selectedTalentId: string | undefined;
  primaryColor: string;
  secondaryColor: string;
  onTalentClick: (talent: Talent) => void;
}

function TalentRow({
  tier,
  selectedTalentId,
  primaryColor,
  secondaryColor,
  onTalentClick
}: TalentRowProps) {
  const { team, selectedCharacterId } = useGameStore();
  const selectedCharacter = team.find(c => c.id === selectedCharacterId);
  const isUnlocked = selectedCharacter ? isTierUnlocked(selectedCharacter.level, tier.level) : false;
  const hasSelection = !!selectedTalentId;

  return (
    <div style={{
      flex: 1,
      display: 'flex',
      gap: '0.5rem',
      minHeight: 0,
    }}>
      {/* Level indicator - sharp styling */}
      <div style={{
        width: '44px',
        flexShrink: 0,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        background: hasSelection 
          ? `linear-gradient(180deg, ${primaryColor}20 0%, transparent 100%)`
          : 'linear-gradient(180deg, rgba(40,36,30,0.5) 0%, rgba(25,22,18,0.3) 100%)',
        borderRadius: '3px',
        border: hasSelection 
          ? `1px solid ${primaryColor}60`
          : '1px solid rgba(70,60,50,0.4)',
        transition: 'all 0.15s ease',
      }}>
        <div style={{
          fontSize: '1.1rem',
          fontWeight: 700,
          color: isUnlocked ? (hasSelection ? primaryColor : 'rgba(255,255,255,0.55)') : 'rgba(100,80,60,0.5)',
          transition: 'all 0.15s ease',
        }}>
          {tier.level}
        </div>
        <div style={{
          fontSize: '0.5rem',
          color: 'rgba(255,255,255,0.4)',
          textTransform: 'uppercase',
          letterSpacing: '0.05em',
          fontWeight: 600,
        }}>
          LVL
        </div>
      </div>

      {/* Talent Cards */}
      <div style={{
        flex: 1,
        display: 'grid',
        gridTemplateColumns: 'repeat(3, 1fr)',
        gap: '0.4rem',
        minHeight: 0,
      }}>
        {tier.talents.map((talent) => (
          <TalentCard
            key={talent.id}
            talent={talent}
            isSelected={selectedTalentId === talent.id}
            isOtherSelected={!!(selectedTalentId && selectedTalentId !== talent.id)}
            isUnlocked={isUnlocked}
            primaryColor={primaryColor}
            secondaryColor={secondaryColor}
            onClick={() => onTalentClick(talent)}
          />
        ))}
      </div>
    </div>
  );
}

interface TalentCardProps {
  talent: Talent;
  isSelected: boolean;
  isOtherSelected: boolean;
  isUnlocked: boolean;
  primaryColor: string;
  secondaryColor: string;
  onClick: () => void;
}

function TalentCard({
  talent,
  isSelected,
  isOtherSelected,
  isUnlocked,
  primaryColor,
  secondaryColor,
  onClick
}: TalentCardProps) {
  return (
    <motion.div
      whileHover={{ scale: 1.01 }}
      whileTap={{ scale: 0.99 }}
      onClick={onClick}
      style={{
        position: 'relative',
        padding: '0.5rem 0.6rem',
        borderRadius: '3px',
        cursor: isUnlocked ? 'pointer' : 'not-allowed',
        background: isUnlocked
          ? (isSelected
              ? `linear-gradient(180deg, ${primaryColor}30 0%, rgba(20,18,14,0.95) 100%)`
              : 'linear-gradient(180deg, rgba(35,32,28,0.95) 0%, rgba(22,20,16,0.98) 100%)')
          : 'linear-gradient(180deg, rgba(20,18,14,0.95) 0%, rgba(12,10,8,0.98) 100%)',
        border: isUnlocked
          ? (isSelected
              ? `1px solid ${primaryColor}`
              : '1px solid rgba(80,70,55,0.5)')
          : '1px solid rgba(40,30,20,0.3)',
        boxShadow: isUnlocked && isSelected
          ? `0 0 20px ${primaryColor}40, inset 0 1px 0 ${primaryColor}30`
          : 'inset 0 1px 0 rgba(255,255,255,0.03)',
        opacity: isUnlocked ? (isOtherSelected ? 0.45 : 1) : 0.4,
        transition: 'all 0.15s ease',
        display: 'flex',
        flexDirection: 'column',
        gap: '0.3rem',
        overflow: 'hidden',
        height: '100%',
      }}
    >
      {/* Selected accent line at top */}
      {isSelected && (
        <div style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          height: '2px',
          background: `linear-gradient(90deg, ${primaryColor}80, ${primaryColor}, ${primaryColor}80)`,
          pointerEvents: 'none',
        }} />
      )}
      {/* Header row: icon + name */}
      <div style={{ 
        display: 'flex', 
        alignItems: 'center', 
        gap: '0.4rem',
        flexShrink: 0,
      }}>
        <div style={{
          width: '28px',
          height: '28px',
          borderRadius: '2px',
          background: isSelected
            ? `linear-gradient(180deg, ${primaryColor} 0%, ${secondaryColor} 100%)`
            : 'linear-gradient(180deg, rgba(50,45,38,0.95) 0%, rgba(35,32,26,0.98) 100%)',
          border: `1px solid ${isSelected ? primaryColor : 'rgba(80,70,55,0.5)'}`,
          boxShadow: isSelected 
            ? `0 0 10px ${primaryColor}50` 
            : 'none',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontSize: '1rem',
          color: isUnlocked ? (isSelected ? '#fff' : 'rgba(255,255,255,0.7)') : 'rgba(100,80,60,0.5)',
          flexShrink: 0,
        }}>
          {renderIcon(talent.icon, '1rem')}
        </div>
        
        <div style={{ 
          flex: 1,
          fontSize: '0.85rem',
          fontFamily: "'Cinzel', Georgia, serif",
          fontWeight: 600,
          color: isUnlocked ? (isSelected ? '#fff' : '#e8e0d0') : 'rgba(100,80,60,0.6)',
          textShadow: isSelected ? `0 0 15px ${primaryColor}80, 0 1px 2px rgba(0,0,0,0.5)` : '0 1px 2px rgba(0,0,0,0.3)',
          lineHeight: 1.15,
          overflow: 'hidden',
          textOverflow: 'ellipsis',
          whiteSpace: 'nowrap',
        }}>
          {talent.name}
        </div>

        {isSelected && (
          <div style={{
            width: '16px',
            height: '16px',
            borderRadius: '2px',
            background: primaryColor,
            border: '1px solid rgba(255,255,255,0.2)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '0.6rem',
            color: '#fff',
            fontWeight: 'bold',
            flexShrink: 0,
          }}>
            ✓
          </div>
        )}
      </div>

      {/* Description - flexible, will truncate */}
      <div style={{
        flex: 1,
        fontSize: '0.78rem',
        fontFamily: "'Inter', 'Segoe UI', system-ui, sans-serif",
        fontWeight: 400,
          color: isUnlocked ? (isSelected ? 'rgba(255,255,255,0.95)' : 'rgba(220,215,200,0.75)') : 'rgba(100,80,60,0.5)',
        lineHeight: 1.5,
        letterSpacing: '0.01em',
        overflow: 'hidden',
        display: '-webkit-box',
        WebkitLineClamp: 3,
        WebkitBoxOrient: 'vertical',
        textShadow: '0 1px 2px rgba(0,0,0,0.3)',
      }}>
        {talent.shortDesc}
      </div>
    </motion.div>
  );
}
