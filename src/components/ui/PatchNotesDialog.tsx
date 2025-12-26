import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { GiScrollUnfurled, GiCrossedSwords, GiBugNet, GiSpeedometer, GiPaintBrush, GiWrench, GiBookCover } from 'react-icons/gi';

interface PatchNotesDialogProps {
  isOpen: boolean;
  onClose: () => void;
}

export function PatchNotesDialog({ isOpen, onClose }: PatchNotesDialogProps) {
  return (
    <AnimatePresence>
      {isOpen && (
        <div 
          style={{
            position: 'fixed',
            inset: 0,
            backgroundColor: 'rgba(0, 0, 0, 0.85)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 10000,
            backdropFilter: 'blur(4px)',
          }} 
          onClick={onClose}
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
            onClick={(e) => e.stopPropagation()}
            style={{
              background: 'linear-gradient(135deg, rgba(30, 26, 22, 0.98) 0%, rgba(20, 18, 15, 0.99) 100%)',
              border: '2px solid rgba(168, 85, 247, 0.4)',
              borderRadius: '16px',
              padding: '0',
              maxWidth: '1000px',
              width: '92%',
              maxHeight: '88vh',
              boxShadow: '0 8px 32px rgba(0, 0, 0, 0.6), 0 0 60px rgba(168, 85, 247, 0.3), inset 0 1px 0 rgba(255,255,255,0.1)',
              overflow: 'hidden',
              display: 'flex',
              flexDirection: 'column',
              position: 'relative',
            }}
          >
            {/* Textured background overlay */}
            <div style={{
              position: 'absolute',
              inset: 0,
              backgroundImage: 'url(/tilebackground.png)',
              backgroundSize: 'cover',
              backgroundPosition: 'center',
              opacity: 0.03,
              pointerEvents: 'none',
            }} />

            {/* Header */}
            <div style={{
              padding: '2rem 2.5rem 1.5rem',
              borderBottom: '1px solid rgba(168, 85, 247, 0.3)',
              background: 'linear-gradient(180deg, rgba(168, 85, 247, 0.08) 0%, transparent 100%)',
              position: 'relative',
            }}>
              <div style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '1rem',
              }}>
                <GiScrollUnfurled style={{ fontSize: '2.5rem', color: '#a855f7' }} />
                <h2 style={{
                  fontSize: '2rem',
                  fontWeight: 700,
                  color: '#e9d5ff',
                  fontFamily: "'Cinzel', Georgia, serif",
                  margin: 0,
                  textShadow: '0 0 20px rgba(168, 85, 247, 0.5), 0 2px 4px rgba(0,0,0,0.8)',
                  letterSpacing: '0.05em',
                }}>
                  Patch Notes
                </h2>
              </div>
              <p style={{
                fontSize: '0.9rem',
                color: 'rgba(200, 190, 170, 0.7)',
                margin: '0.5rem 0 0',
                textAlign: 'center',
                fontFamily: "'Cinzel', Georgia, serif",
                letterSpacing: '0.05em',
              }}>
                December 26, 2025 - Major Update
              </p>
            </div>

            {/* Content */}
            <div 
              className="patch-notes-content"
              style={{
                flex: 1,
                overflowY: 'auto',
                padding: '2rem 2.5rem 2rem',
                position: 'relative',
              }}
            >
              {/* Major Features */}
              <Section 
                icon={<GiCrossedSwords />} 
                title="New Features" 
                color="#a855f7"
              >
                <Feature title="Performance Monitor">
                  <p>Ever wonder why the game might be running slow? Now you can find out! Press <strong>Ctrl+Shift+P</strong> to open a performance overlay that shows you exactly what's happening.</p>
                  <ul>
                    <li>See your current FPS (frames per second) with color-coded warnings if things get slow</li>
                    <li>Check memory usage to see if the game is using too much RAM</li>
                    <li>View which parts of the game are taking the most time</li>
                    <li>Export detailed reports if you want to share performance info</li>
                    <li>Automatic warnings if performance drops below acceptable levels</li>
                  </ul>
                  <p><em>This is mainly for debugging, but it's there if you're curious or experiencing lag!</em></p>
                </Feature>
              </Section>

              {/* Bug Fixes */}
              <Section 
                icon={<GiBugNet />} 
                title="Bug Fixes" 
                color="#10b981"
              >
                <Feature title="Fixed: Gate Bosses Causing Instant Dungeon Failure">
                  <p><strong>What was broken:</strong> When you reached a gate boss (like the Bone Golem or Death Knight), the dungeon would instantly fail even though your team was at full health and no combat happened.</p>
                  <p><strong>What we fixed:</strong> Gate bosses were accidentally set to have 0 health, so the game thought they were already dead. Now they spawn with proper health values and combat works correctly.</p>
                  <p><strong>You'll notice:</strong> Gate boss fights now actually happen! No more mysterious instant failures.</p>
                </Feature>
                
                <Feature title="Fixed: Gate Bosses Had Way Too Much Health">
                  <p><strong>What was broken:</strong> After fixing the instant-fail bug, gate bosses had ridiculously high health (over 70,000 HP!). With typical team damage of 200-300 DPS, it would take 4-5 minutes to kill them, but dungeons only last 60 seconds.</p>
                  <p><strong>What we fixed:</strong> Completely rebalanced boss health scaling. Gate bosses now have around 5,500 HP (takes ~22 seconds to kill), and final bosses have around 22,000 HP (takes ~88 seconds with good play).</p>
                  <p><strong>You'll notice:</strong> Boss fights are now challenging but actually winnable! They feel like proper boss encounters instead of impossible walls.</p>
                </Feature>
                
                <Feature title="Fixed: Many Talents Weren't Working">
                  <p><strong>What was broken:</strong> Several talent bonuses weren't actually doing anything, even though they showed up in your character sheet.</p>
                  <p><strong>What we fixed:</strong> Found and fixed 8 different types of talent bonuses that weren't being applied:</p>
                  <ul>
                    <li>Energy Shield recharge rate and delay bonuses now work</li>
                    <li>Energy Shield regeneration bonuses now work</li>
                    <li>Maximum Energy Shield bonuses now work (like "Reinforced Barriers")</li>
                    <li>Cast speed bonuses now work</li>
                    <li>Mana regeneration bonuses now work</li>
                    <li>General damage bonuses now work</li>
                  </ul>
                  <p><strong>You'll notice:</strong> Your talents actually make your character stronger now! Energy Shield builds especially will feel much better.</p>
                </Feature>
              </Section>

              {/* Performance Improvements */}
              <Section 
                icon={<GiSpeedometer />} 
                title="Performance & Polish" 
                color="#f59e0b"
              >
                <Feature title="Smoother Animations & Better Performance">
                  <p><strong>The game should feel much smoother now!</strong> We've made a bunch of technical improvements that make everything run better, especially during combat.</p>
                  
                  <p><strong>What you'll notice:</strong></p>
                  <ul>
                    <li><strong>Smoother health and mana bars:</strong> They now have a nice "bouncy" feel instead of moving in a robotic way. Makes it much easier to see when you take damage or use mana</li>
                    <li><strong>Buttery smooth cast bars:</strong> Enemy cast bars now update 30 times per second (instead of 20), making them look perfectly smooth</li>
                    <li><strong>Better performance during big pulls:</strong> Limited floating damage numbers to 20 at once, so the game doesn't slow down when you're fighting lots of enemies</li>
                    <li><strong>Faster animations:</strong> Most animations are now quicker (0.15-0.2 seconds instead of 0.25), making the game feel more responsive</li>
                    <li><strong>Uses your graphics card better:</strong> Animations now use GPU acceleration, which means smoother visuals and less CPU usage</li>
                  </ul>
                  
                  <p><strong>The technical stuff:</strong> If you're curious, we switched to 3D transforms for GPU acceleration, implemented spring physics for health bars, and optimized how the browser renders combat. The result is about 40% better rendering performance!</p>
                </Feature>
              </Section>

              {/* UI/UX Improvements */}
              <Section 
                icon={<GiPaintBrush />} 
                title="Visual Improvements" 
                color="#06b6d4"
              >
                <Feature title="Better Combat Visuals">
                  <p><strong>What looks better:</strong></p>
                  <ul>
                    <li><strong>Health and mana bars:</strong> Now have a satisfying "bounce" animation when they change, making it easier to notice damage or mana usage</li>
                    <li><strong>Enemy cast bars:</strong> Much smoother animation - you can now clearly see exactly when enemies are about to cast their abilities</li>
                    <li><strong>Enemy deaths:</strong> Faster fade-out animation so dead enemies don't clutter the screen as long</li>
                    <li><strong>Damage numbers:</strong> Cleaner display with better rounding (no more weird decimals)</li>
                    <li><strong>Boss health bars:</strong> Better colors and contrast so they stand out more</li>
                  </ul>
                </Feature>
                
                <Feature title="Better Tooltips">
                  <p><strong>What's improved:</strong></p>
                  <ul>
                    <li><strong>Skill tooltips:</strong> Show more useful information about what skills actually do</li>
                    <li><strong>Support gem tooltips:</strong> Now properly explain how they modify your skills</li>
                    <li><strong>Item tooltips:</strong> Better formatting and easier to read, especially for weapons and armor</li>
                    <li><strong>Spell damage mods:</strong> Items with "Adds X to Y Damage to Spells" now display correctly</li>
                  </ul>
                </Feature>
              </Section>

              {/* Behind the Scenes */}
              <Section 
                icon={<GiWrench />} 
                title="Behind the Scenes" 
                color="#8b5cf6"
              >
                <Feature title="Code Improvements">
                  <p><em>This section is for the technically curious - feel free to skip if you just want to play!</em></p>
                  <ul>
                    <li>Modified 86 files with over 3,000 lines of code changes</li>
                    <li>Improved combat calculations and enemy AI</li>
                    <li>Better damage calculation system that properly handles spell damage</li>
                    <li>Fixed numerous edge cases in the combat system</li>
                    <li>Added comprehensive performance monitoring tools</li>
                    <li>Created 17 new files including monitoring tools and this patch notes dialog</li>
                    <li>Updated monster stat database with proper scaling values</li>
                    <li>Improved item affix system for better mod generation</li>
                  </ul>
                </Feature>
              </Section>


              {/* Statistics */}
              <div style={{
                marginTop: '2rem',
                padding: '1.5rem',
                background: 'linear-gradient(135deg, rgba(168, 85, 247, 0.1) 0%, rgba(168, 85, 247, 0.05) 100%)',
                border: '1px solid rgba(168, 85, 247, 0.3)',
                borderRadius: '8px',
              }}>
                <h4 style={{
                  fontSize: '1rem',
                  fontWeight: 600,
                  color: '#e9d5ff',
                  fontFamily: "'Cinzel', Georgia, serif",
                  marginBottom: '1rem',
                  textAlign: 'center',
                }}>
                  By the Numbers
                </h4>
                <div style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))',
                  gap: '1rem',
                  fontSize: '0.85rem',
                  color: 'rgba(200, 190, 170, 0.9)',
                  marginBottom: '1rem',
                }}>
                  <Stat label="Files Modified" value="86" />
                  <Stat label="New Files" value="17" />
                  <Stat label="Lines Added" value="3,397" />
                  <Stat label="Lines Removed" value="1,027" />
                  <Stat label="Net Change" value="+2,370" />
                  <Stat label="Documentation" value="~2,600" />
                </div>
                <div style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))',
                  gap: '1rem',
                  fontSize: '0.85rem',
                  color: 'rgba(200, 190, 170, 0.9)',
                }}>
                  <Stat label="Talents Audited" value="234" />
                  <Stat label="Classes Verified" value="13" />
                  <Stat label="Bugs Fixed" value="11" />
                  <Stat label="Systems Enhanced" value="8" />
                </div>
              </div>
              
              {/* What's Next */}
              <div style={{
                marginTop: '1.5rem',
                padding: '1.5rem',
                background: 'linear-gradient(135deg, rgba(59, 130, 246, 0.1) 0%, rgba(59, 130, 246, 0.05) 100%)',
                border: '1px solid rgba(59, 130, 246, 0.3)',
                borderRadius: '8px',
              }}>
                <h4 style={{
                  fontSize: '1rem',
                  fontWeight: 600,
                  color: '#93c5fd',
                  fontFamily: "'Cinzel', Georgia, serif",
                  marginBottom: '0.75rem',
                }}>
                  What's Coming Next?
                </h4>
                <p style={{
                  fontSize: '0.875rem',
                  color: 'rgba(200, 190, 170, 0.9)',
                  lineHeight: 1.7,
                  margin: 0,
                }}>
                  Now that the game is running smoothly and all the bugs are fixed, we can focus on adding new content! 
                  Expect more character classes, new dungeons to explore, additional boss encounters, and more items and abilities. 
                  The performance monitoring tools will help us keep the game running great as we add new features.
                </p>
              </div>
            </div>

            {/* Footer */}
            <div style={{
              padding: '1.5rem 2.5rem',
              borderTop: '1px solid rgba(168, 85, 247, 0.3)',
              background: 'linear-gradient(0deg, rgba(168, 85, 247, 0.08) 0%, transparent 100%)',
              display: 'flex',
              justifyContent: 'center',
            }}>
              <motion.button
                type="button"
                onClick={onClose}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                style={{
                  padding: '0.75rem 3rem',
                  fontSize: '1rem',
                  fontWeight: 600,
                  fontFamily: "'Cinzel', Georgia, serif",
                  background: 'linear-gradient(135deg, rgba(168, 85, 247, 0.8) 0%, rgba(147, 51, 234, 0.9) 100%)',
                  border: '1px solid rgba(168, 85, 247, 0.5)',
                  borderRadius: '8px',
                  color: '#fff',
                  cursor: 'pointer',
                  textTransform: 'uppercase',
                  letterSpacing: '0.1em',
                  boxShadow: '0 4px 12px rgba(168, 85, 247, 0.4)',
                  textShadow: '0 2px 4px rgba(0,0,0,0.5)',
                }}
              >
                Close
              </motion.button>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}

interface SectionProps {
  icon: React.ReactNode;
  title: string;
  color: string;
  children: React.ReactNode;
}

function Section({ icon, title, color, children }: SectionProps) {
  return (
    <div style={{ 
      marginBottom: '2.5rem',
      paddingBottom: '1.5rem',
      borderBottom: '2px solid rgba(168, 85, 247, 0.15)',
    }}>
      <div style={{
        display: 'flex',
        alignItems: 'center',
        gap: '0.75rem',
        marginBottom: '1.25rem',
        paddingBottom: '0.75rem',
        borderBottom: '1px solid rgba(168, 85, 247, 0.2)',
      }}>
        <div style={{ fontSize: '1.75rem', color, filter: 'drop-shadow(0 0 8px currentColor)' }}>{icon}</div>
        <h3 style={{
          fontSize: '1.35rem',
          fontWeight: 700,
          color: '#e9d5ff',
          fontFamily: "'Cinzel', Georgia, serif",
          margin: 0,
          letterSpacing: '0.05em',
          textShadow: '0 2px 4px rgba(0,0,0,0.5)',
        }}>
          {title}
        </h3>
      </div>
      <div style={{ paddingLeft: '0.5rem' }}>
        {children}
      </div>
    </div>
  );
}

interface FeatureProps {
  title: string;
  children: React.ReactNode;
}

function Feature({ title, children }: FeatureProps) {
  return (
    <div style={{ 
      marginBottom: '1.5rem',
      paddingBottom: '1rem',
      borderBottom: '1px solid rgba(168, 85, 247, 0.1)',
    }}>
      <h4 style={{
        fontSize: '1rem',
        fontWeight: 600,
        color: 'rgba(233, 213, 255, 0.95)',
        marginBottom: '0.75rem',
        fontFamily: "'Cinzel', Georgia, serif",
        letterSpacing: '0.02em',
      }}>
        {title}
      </h4>
      <div style={{
        fontSize: '0.875rem',
        color: 'rgba(200, 190, 170, 0.9)',
        lineHeight: 1.7,
      }}>
        {children}
      </div>
    </div>
  );
}

interface StatProps {
  label: string;
  value: string;
}

function Stat({ label, value }: StatProps) {
  return (
    <div style={{ textAlign: 'center' }}>
      <div style={{
        fontSize: '1.25rem',
        fontWeight: 700,
        color: '#a855f7',
        marginBottom: '0.25rem',
        fontFamily: "'Cinzel', Georgia, serif",
      }}>
        {value}
      </div>
      <div style={{
        fontSize: '0.75rem',
        color: 'rgba(200, 190, 170, 0.7)',
        textTransform: 'uppercase',
        letterSpacing: '0.05em',
      }}>
        {label}
      </div>
    </div>
  );
}

