import React, { useState } from 'react';
import { BADGES_CONFIG } from '../constants';
import { calculateBadges, getBadgeStats, getRecentBadges } from '../utils/achievements';
import '../styles/common.css';

const BadgesSection = ({ participantData, allParticipants = [] }) => {
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [showEarnedOnly, setShowEarnedOnly] = useState(false);

  const badges = calculateBadges(allParticipants);
  const stats = getBadgeStats(badges);
  const recentBadges = getRecentBadges(badges.earned);

  const categories = [
    { id: 'all', name: 'All Badges', icon: '🏆' },
    { id: 'current_best', name: 'Current Bests', icon: '👑' },
    { id: 'funny', name: 'Funny Badges', icon: '😄' },
    { id: 'milestone', name: 'Milestones', icon: '⭐' }
  ];

  const getFilteredBadges = () => {
    let allBadges = [];
    
    // Add all badge types
    allBadges.push(...BADGES_CONFIG.CURRENT_BESTS);
    allBadges.push(...BADGES_CONFIG.FUNNY_BADGES);
    allBadges.push(...BADGES_CONFIG.SPECIAL_MILESTONES);

    // Filter by category
    if (selectedCategory !== 'all') {
      allBadges = allBadges.filter(badge => badge.category === selectedCategory);
    }

    // Filter by earned status
    if (showEarnedOnly) {
      const earnedIds = badges.earned.map(b => b.id);
      allBadges = allBadges.filter(badge => earnedIds.includes(badge.id));
    }

    return allBadges;
  };

  const getBadgeStatus = (badgeId) => {
    const earned = badges.earned.find(b => b.id === badgeId);
    if (earned) {
      return { 
        earned: true, 
        value: earned.value, 
        earnedAt: earned.earnedAt,
        earnedBy: earned.earnedBy || participantData?.name,
        earnedByCurrentPerson: earned.earnedBy === participantData?.name || !earned.earnedBy
      };
    }
    
    // Check if someone else has earned this badge
    const someoneElseEarned = checkIfSomeoneElseEarned(badgeId);
    return { 
      earned: false, 
      disabled: someoneElseEarned.disabled,
      earnedBy: someoneElseEarned.earnedBy
    };
  };

  const checkIfSomeoneElseEarned = (badgeId) => {
    // Check if someone else has already earned this badge based on actual data
    const someoneElseEarned = badges.earned.find(b => b.id === badgeId);
    if (someoneElseEarned) {
      return { 
        disabled: true, 
        earnedBy: someoneElseEarned.earnedBy 
      };
    }
    
    return { disabled: false, earnedBy: null };
  };

  const BadgeCard = ({ badge, status }) => (
    <div className={`badge-card ${status.earned ? 'earned' : status.disabled ? 'disabled' : 'unearned'}`}>
      <div className="badge-icon" style={{ color: badge.color }}>
        {badge.icon}
      </div>
      <div className="badge-content">
        <h4 className="badge-name">{badge.name}</h4>
        <p className="badge-description">{badge.description}</p>
        
        {status.earned && (
          <div className="badge-earned-info">
            <span className="badge-value">{status.value}</span>
            <span className="badge-date">
              {new Date(status.earnedAt).toLocaleDateString('en-GB')}
            </span>
          </div>
        )}
        
        {status.earnedBy && status.earned && (
          <div className="badge-earned-by">
            <span className="earned-by-label">Earned by:</span>
            <span className="earned-by-name">
              {status.earnedBy}
            </span>
          </div>
        )}
        
        {status.disabled && !status.earned && (
          <div className="badge-disabled-info">
            <span className="disabled-label">Already earned by {status.earnedBy}</span>
          </div>
        )}
      </div>
      
      {status.earned && (
        <div className="badge-earned-indicator">
          <span className="earned-check">✓</span>
        </div>
      )}
      
      {status.disabled && !status.earned && (
        <div className="badge-disabled-indicator">
          <span className="disabled-icon">🔒</span>
        </div>
      )}
    </div>
  );

  return (
    <div className="badges-section">
      {/* Header with stats */}
      <div className="badges-header">
        <div className="badges-title">
          <h2>🏅 Badges & Achievements</h2>
          <p>Fun achievements for the friend group</p>
        </div>
        <div className="badges-stats">
          <div className="stat-card">
            <span className="stat-number">{stats.earned}</span>
            <span className="stat-label">Earned</span>
          </div>
          <div className="stat-card">
            <span className="stat-number">{stats.total}</span>
            <span className="stat-label">Total</span>
          </div>
          <div className="stat-card">
            <span className="stat-number">{stats.completionRate}%</span>
            <span className="stat-label">Complete</span>
          </div>
        </div>
      </div>

      {/* Recent badges */}
      {recentBadges.length > 0 && (
        <div className="recent-badges">
          <h3>🎉 Recently Earned</h3>
          <div className="recent-badges-grid">
            {recentBadges.slice(0, 5).map((badge, index) => (
              <div key={index} className="recent-badge">
                <span className="recent-badge-icon" style={{ color: badge.color }}>
                  {badge.icon}
                </span>
                <span className="recent-badge-name">{badge.name}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Filters */}
      <div className="badges-filters">
        <div className="category-tabs">
          {categories.map(category => (
            <button
              key={category.id}
              className={`category-tab ${selectedCategory === category.id ? 'active' : ''}`}
              onClick={() => setSelectedCategory(category.id)}
            >
              <span className="category-icon">{category.icon}</span>
              <span className="category-name">{category.name}</span>
            </button>
          ))}
        </div>
        <div className="filter-toggle">
          <label className="toggle-label">
            <input
              type="checkbox"
              checked={showEarnedOnly}
              onChange={(e) => setShowEarnedOnly(e.target.checked)}
            />
            <span className="toggle-slider"></span>
            Show earned only
          </label>
        </div>
      </div>

      {/* Badges grid */}
      <div className="badges-grid">
        {getFilteredBadges().map((badge, index) => {
          const status = getBadgeStatus(badge.id);
          return (
            <BadgeCard key={`${badge.id}-${index}`} badge={badge} status={status} />
          );
        })}
      </div>

      {/* Empty state */}
      {getFilteredBadges().length === 0 && (
        <div className="empty-badges">
          <div className="empty-icon">🏆</div>
          <h3>No badges found</h3>
          <p>Try adjusting your filters or keep stepping to earn more badges!</p>
        </div>
      )}
    </div>
  );
};

export default BadgesSection; 