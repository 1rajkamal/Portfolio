import React, { useState, useEffect, useRef } from 'react';
import { Plus, X, User } from 'lucide-react';
import { netflixAudio } from '../utils/netflixAudio';

export interface NetflixProfile {
  id: string;
  name: string;
  role: string;
  avatar: string;
  tagline: string;
}

export const NETFLIX_PROFILES: NetflixProfile[] = [
  {
    id: 'raj',
    name: 'Raj Kamal',
    role: 'Creator & Engineer',
    avatar: '/avatars/raj.jpg',
    tagline: 'Full Stack & Data Science Portfolio'
  },
  {
    id: 'recruiter',
    name: 'Recruiter',
    role: 'Talent Scout',
    avatar: '/avatars/recruiter.jpg',
    tagline: 'Skills, Resume & Enterprise Highlights'
  },
  {
    id: 'developer',
    name: 'Developer',
    role: 'Code Explorer',
    avatar: '/avatars/developer.jpg',
    tagline: 'Tech Stack, Systems & Architecture'
  }
];

interface WhoIsWatchingProps {
  isOpen: boolean;
  isIntroActive?: boolean;
  onSelectProfile: (profile: NetflixProfile) => void;
  onClose?: () => void;
}

export const WhoIsWatching: React.FC<WhoIsWatchingProps> = ({
  isOpen,
  isIntroActive = false,
  onSelectProfile,
  onClose
}) => {
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [isFadingOut, setIsFadingOut] = useState(false);
  const [showAddModal, setShowAddModal] = useState(false);
  const [customName, setCustomName] = useState('');
  const inputRef = useRef<HTMLInputElement | null>(null);

  useEffect(() => {
    if (!isOpen) {
      setSelectedId(null);
      setIsFadingOut(false);
      setShowAddModal(false);
      return;
    }

    const handleKeyDown = (e: KeyboardEvent) => {
      // Never intercept keys while the R intro animation is playing
      if (isIntroActive) return;

      if (showAddModal) {
        if (e.key === 'Escape') {
          e.stopPropagation();
          setShowAddModal(false);
        }
        return;
      }

      if (e.key >= '1' && e.key <= '3') {
        const idx = parseInt(e.key, 10) - 1;
        if (NETFLIX_PROFILES[idx]) {
          handleCardClick(NETFLIX_PROFILES[idx]);
        }
      } else if (e.key === '4') {
        setShowAddModal(true);
      } else if (e.key === 'Escape' && onClose) {
        onClose();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, isIntroActive, onClose, showAddModal]);

  useEffect(() => {
    if (showAddModal) {
      setTimeout(() => inputRef.current?.focus(), 100);
    }
  }, [showAddModal]);

  const handleCardClick = (profile: NetflixProfile) => {
    setSelectedId(profile.id);
    setIsFadingOut(true);
    netflixAudio.playProfileClick();

    setTimeout(() => {
      onSelectProfile(profile);
      setIsFadingOut(false);
      setShowAddModal(false);
    }, 500);
  };

  const handleCreateCustomProfile = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    const finalName = customName.trim() || 'Guest Explorer';
    const guestProfile: NetflixProfile = {
      id: `custom-${Date.now()}`,
      name: finalName,
      role: 'Guest Explorer',
      avatar: '/avatars/designer.jpg',
      tagline: 'Custom Guest Profile'
    };
    handleCardClick(guestProfile);
  };

  if (!isOpen) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label="Profile Selection - Who's watching?"
      className={`fixed inset-0 z-[99990] bg-[#141414] text-white flex flex-col items-center justify-center p-6 transition-all duration-700 ease-out overflow-y-auto select-none ${
        isFadingOut ? 'opacity-0 scale-105 pointer-events-none' : 'opacity-100 scale-100'
      }`}
    >
      {/* Background Netflix Crimson Radial Ambient Glow */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[500px] bg-[#E50914]/15 rounded-full blur-[150px] pointer-events-none" />

      {/* Brand Header (Removed NETFLIX SPECIAL banner per request) */}
      <div className="relative z-10 flex flex-col items-center mb-10 sm:mb-14">
        <h1 className="text-3xl sm:text-5xl lg:text-6xl font-display font-medium tracking-tight text-neutral-100 text-center animate-fadeIn">
          Who&apos;s watching?
        </h1>
        <p className="text-xs sm:text-sm text-neutral-400 mt-2.5 text-center max-w-md animate-fadeIn">
          Select a profile to enter Raj Kamal&apos;s developer portfolio
        </p>
      </div>

      {/* Profiles Grid: 3 Main Profiles + 1 Add Profile (+) Card */}
      <div className="relative z-10 flex flex-wrap items-center justify-center gap-6 sm:gap-10 max-w-4xl mx-auto mb-12">
        {NETFLIX_PROFILES.map((profile, index) => {
          const isChosen = selectedId === profile.id;
          return (
            <div
              key={profile.id}
              role="button"
              tabIndex={0}
              onClick={() => handleCardClick(profile)}
              onMouseEnter={() => netflixAudio.playHover()}
              className="group flex flex-col items-center cursor-pointer focus:outline-none transition-transform duration-300 ease-out hover:-translate-y-1.5"
            >
              {/* Profile Avatar Box */}
              <div
                className={`relative w-28 h-28 sm:w-36 sm:h-36 rounded-md overflow-hidden border-2 transition-all duration-300 shadow-xl ${
                  isChosen
                    ? 'border-[#E50914] scale-110 shadow-[0_0_35px_rgba(229,9,20,0.85)]'
                    : 'border-transparent group-hover:border-white group-hover:scale-105 group-hover:shadow-[0_0_25px_rgba(255,255,255,0.4)]'
                }`}
              >
                {/* Gradient Monogram Background Fallback */}
                <div
                  className={`absolute inset-0 flex items-center justify-center bg-gradient-to-br ${
                    profile.id === 'raj'
                      ? 'from-red-600 to-red-950'
                      : profile.id === 'recruiter'
                      ? 'from-blue-600 to-indigo-950'
                      : 'from-emerald-600 to-teal-950'
                  } text-4xl font-extrabold font-display text-white`}
                >
                  {profile.name.charAt(0)}
                </div>
                <img
                  src={profile.avatar}
                  alt={profile.name}
                  className="relative z-10 w-full h-full object-cover group-hover:brightness-110 transition-all duration-300"
                  onError={(e) => {
                    const target = e.currentTarget;
                    if (target.src.indexOf('me.jpg') === -1) {
                      target.src = '/me.jpg';
                    } else {
                      target.style.opacity = '0';
                    }
                  }}
                />
                {/* Keyboard Shortcut Badge */}
                <div className="absolute top-1.5 left-1.5 z-20 w-5 h-5 rounded bg-black/60 backdrop-blur-sm border border-white/20 flex items-center justify-center text-[10px] font-mono font-bold text-neutral-300 group-hover:text-white">
                  {index + 1}
                </div>
              </div>

              {/* Profile Name & Role */}
              <span className="mt-3.5 text-sm sm:text-base font-medium text-neutral-400 group-hover:text-white transition-colors duration-200 text-center">
                {profile.name}
              </span>
              <span className="text-[11px] text-neutral-500 font-mono text-center">
                {profile.role}
              </span>
            </div>
          );
        })}

        {/* 4th Slot: Add Profile (+) Card */}
        <div
          role="button"
          tabIndex={0}
          onClick={() => {
            netflixAudio.playHover();
            setShowAddModal(true);
          }}
          onMouseEnter={() => netflixAudio.playHover()}
          className="group flex flex-col items-center cursor-pointer focus:outline-none transition-transform duration-300 ease-out hover:-translate-y-1.5"
        >
          <div className="relative w-28 h-28 sm:w-36 sm:h-36 rounded-md border-2 border-neutral-700 bg-neutral-900/50 flex items-center justify-center transition-all duration-300 shadow-xl group-hover:border-white group-hover:bg-neutral-800/80 group-hover:scale-105 group-hover:shadow-[0_0_25px_rgba(255,255,255,0.3)]">
            <Plus
              className="w-12 h-12 text-neutral-400 group-hover:text-white transition-all duration-300 group-hover:rotate-90 group-hover:scale-110"
              strokeWidth={2}
            />
            {/* Keyboard Shortcut Badge */}
            <div className="absolute top-1.5 left-1.5 z-20 w-5 h-5 rounded bg-black/60 backdrop-blur-sm border border-white/20 flex items-center justify-center text-[10px] font-mono font-bold text-neutral-400 group-hover:text-white">
              4
            </div>
          </div>
          <span className="mt-3.5 text-sm sm:text-base font-medium text-neutral-400 group-hover:text-white transition-colors duration-200 text-center">
            Add Profile
          </span>
          <span className="text-[11px] text-neutral-500 font-mono text-center">
            Guest & Custom
          </span>
        </div>
      </div>

      {/* Action Footer: Manage Profiles / Direct Entry */}
      <div className="relative z-10 flex flex-wrap items-center justify-center gap-4">
        <button
          type="button"
          onClick={() => handleCardClick(NETFLIX_PROFILES[0])}
          className="px-6 py-2 border border-neutral-600 hover:border-white text-neutral-400 hover:text-white text-xs sm:text-sm font-semibold tracking-wider uppercase transition-all duration-200 bg-transparent rounded-sm hover:bg-white/5"
        >
          Manage Profiles
        </button>
        {onClose && (
          <button
            type="button"
            onClick={onClose}
            className="px-6 py-2 border border-[#E50914] text-[#E50914] hover:bg-[#E50914] hover:text-white text-xs sm:text-sm font-semibold tracking-wider uppercase transition-all duration-200 rounded-sm"
          >
            Enter Portfolio Directly
          </button>
        )}
      </div>

      {/* Interactive Netflix Add Profile Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-[99995] bg-black/80 backdrop-blur-md flex items-center justify-center p-4 animate-fadeIn">
          <div className="relative w-full max-w-md bg-[#181818] border border-neutral-700 rounded-lg p-6 sm:p-8 shadow-2xl">
            <button
              type="button"
              onClick={() => setShowAddModal(false)}
              className="absolute top-4 right-4 p-1 rounded-full text-neutral-400 hover:text-white hover:bg-white/10 transition-colors"
              aria-label="Close modal"
            >
              <X size={18} />
            </button>

            <div className="flex items-center gap-3 mb-6">
              <div className="w-12 h-12 rounded bg-neutral-800 border border-neutral-600 flex items-center justify-center text-neutral-300">
                <User size={24} />
              </div>
              <div>
                <h3 className="text-xl font-display font-bold text-white">Add Profile</h3>
                <p className="text-xs text-neutral-400">Enter your name or company</p>
              </div>
            </div>

            <form onSubmit={handleCreateCustomProfile} className="space-y-4">
              <div>
                <label htmlFor="custom-profile-name" className="block text-xs font-mono text-neutral-300 uppercase tracking-wider mb-2">
                  Profile Name
                </label>
                <input
                  id="custom-profile-name"
                  ref={inputRef}
                  type="text"
                  value={customName}
                  onChange={(e) => setCustomName(e.target.value)}
                  placeholder="e.g. Hiring Manager, Alex, Google..."
                  className="w-full px-4 py-2.5 bg-neutral-900 border border-neutral-700 rounded text-white text-sm focus:outline-none focus:border-[#E50914] focus:ring-1 focus:ring-[#E50914] transition-colors"
                  maxLength={25}
                />
              </div>

              <div className="flex items-center gap-3 pt-3">
                <button
                  type="submit"
                  className="flex-1 py-2.5 px-4 bg-[#E50914] hover:bg-[#B81D24] text-white text-xs sm:text-sm font-bold uppercase tracking-wider rounded transition-all duration-200 shadow-[0_0_20px_rgba(229,9,20,0.4)]"
                >
                  Continue
                </button>
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="py-2.5 px-4 border border-neutral-600 hover:border-white text-neutral-300 hover:text-white text-xs sm:text-sm font-semibold uppercase tracking-wider rounded transition-colors"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
