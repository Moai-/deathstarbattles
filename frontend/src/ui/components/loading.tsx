import { LoadingContainer } from "../styled/containers"

export const Loading = () => {
  return (
    <LoadingContainer>
      <svg
        className="loadingSplashSvg"
        viewBox="0 0 800 450"
        xmlns="http://www.w3.org/2000/svg"
        aria-label="Death Star Battles loading screen"
      >
        <rect width="800" height="450" fill="#06080d" />

        {/* background stars */}
        <g fill="#cfd6e0" opacity="0.9">
          <rect x="210" y="80" width="2" height="2" />
          <rect x="300" y="145" width="2" height="2" />
          <rect x="390" y="70" width="2" height="2" />
          <rect x="615" y="105" width="2" height="2" />
          <rect x="680" y="210" width="2" height="2" />
          <rect x="720" y="320" width="2" height="2" />
          <rect x="560" y="355" width="2" height="2" />
        </g>

        {/* hero star with corona / diffraction spikes */}
        <g transform="translate(640 95)" className="heroStar">
          <circle r="18" fill="#dce6ff" opacity="0.06" />
          <circle r="10" fill="#dce6ff" opacity="0.12" />
          <circle r="4.5" fill="#ffffff" opacity="0.95" />
          <path d="M -22 0 H 22" stroke="#dce6ff" strokeWidth="1.5" opacity="0.35" />
          <path d="M 0 -22 V 22" stroke="#dce6ff" strokeWidth="1.5" opacity="0.35" />
          <path d="M -15 -15 L 15 15" stroke="#dce6ff" strokeWidth="1" opacity="0.2" />
          <path d="M -15 15 L 15 -15" stroke="#dce6ff" strokeWidth="1" opacity="0.2" />
        </g>

        {/* death star, mostly offscreen left */}
        <g transform="translate(-150 285)">
          {/* main body */}
          <circle r="250" fill="#767d86" />
          <circle r="247" fill="none" stroke="#98a1ab" strokeWidth="5" opacity="0.35" />

          {/* spherical shading to imply volume */}
          <ellipse cx="45" cy="10" rx="180" ry="228" fill="#000000" opacity="0.12" />
          <ellipse cx="-55" cy="-25" rx="120" ry="170" fill="#ffffff" opacity="0.04" />

          {/* main equatorial trench */}
          <g>
            {/* soft shadow above trench */}
            <path
              d="M -160 -14 H 208"
              stroke="#2b2f36"
              strokeWidth="18"
              opacity="0.16"
              strokeLinecap="round"
            />

            {/* trench body */}
            <path
              d="M -165 -6 H 212"
              stroke="#4b515a"
              strokeWidth="11"
              opacity="0.9"
              strokeLinecap="round"
            />

            {/* bright lower lip to imply inset depth */}
            <path
              d="M -158 2 H 205"
              stroke="#8f98a3"
              strokeWidth="3"
              opacity="0.22"
              strokeLinecap="round"
            />

            {/* darker core line */}
            <path
              d="M -162 -6 H 209"
              stroke="#2f333a"
              strokeWidth="4"
              opacity="0.55"
              strokeLinecap="round"
            />

            {/* suggestion that the trench curves around the sphere */}
            <path
              d="M 188 -6 C 214 -8, 232 2, 241 18"
              stroke="#3a3f47"
              strokeWidth="8"
              opacity="0.55"
              fill="none"
              strokeLinecap="round"
            />
            <path
              d="M 191 -2 C 212 0, 226 9, 234 22"
              stroke="#8e97a1"
              strokeWidth="2"
              opacity="0.18"
              fill="none"
              strokeLinecap="round"
            />
          </g>

          {/* surface greebles */}
          <g opacity="0.42">
            {/* upper band */}
            <rect x="-40" y="-150" width="42" height="8" fill="#5b616a" rx="2" />
            <rect x="10" y="-148" width="28" height="6" fill="#666d76" rx="2" />
            <rect x="48" y="-154" width="58" height="10" fill="#5b616a" rx="2" />
            <rect x="116" y="-149" width="24" height="7" fill="#666d76" rx="2" />

            {/* mid-upper cluster */}
            <rect x="-82" y="-92" width="52" height="9" fill="#5a6068" rx="2" />
            <rect x="-20" y="-96" width="22" height="16" fill="#4e545d" rx="2" />
            <rect x="14" y="-91" width="74" height="8" fill="#636a73" rx="2" />
            <rect x="98" y="-95" width="36" height="14" fill="#555b64" rx="2" />
            <rect x="145" y="-90" width="26" height="7" fill="#666d76" rx="2" />

            {/* around dish area, but not too busy */}
            <rect x="92" y="-48" width="34" height="7" fill="#5b616a" rx="2" />
            <rect x="132" y="-38" width="22" height="18" fill="#4d535b" rx="2" />
            <rect x="160" y="-24" width="20" height="7" fill="#666d76" rx="2" />

            {/* lower band */}
            <rect x="-60" y="64" width="66" height="8" fill="#5a6068" rx="2" />
            <rect x="18" y="59" width="24" height="16" fill="#4e545d" rx="2" />
            <rect x="54" y="65" width="82" height="8" fill="#636a73" rx="2" />
            <rect x="146" y="60" width="28" height="14" fill="#555b64" rx="2" />

            {/* far lower subtle structures */}
            <rect x="-18" y="132" width="52" height="7" fill="#5b616a" rx="2" />
            <rect x="44" y="128" width="30" height="14" fill="#4e545d" rx="2" />
            <rect x="86" y="133" width="40" height="7" fill="#666d76" rx="2" />
          </g>

          {/* a few faint vertical seams to help curvature */}
          <g opacity="0.2">
            <path d="M -18 -178 V 176" stroke="#434952" strokeWidth="3" />
            <path d="M 42 -168 V 168" stroke="#5e6670" strokeWidth="2" />
            <path d="M 98 -150 V 148" stroke="#434952" strokeWidth="3" />
          </g>

          {/* laser dish, skewed/rotated to read as seen from the side */}
          <g transform="translate(185 -85) rotate(-24)">
            <ellipse rx="25" ry="42" fill="#4b5058" />
            <ellipse rx="16" ry="28" fill="#353941" />
            <ellipse rx="7" ry="13" fill="#23262c" />
            <ellipse
              cx="-8"
              cy="-5"
              rx="5"
              ry="10"
              fill="#ffffff"
              opacity="0.07"
            />
          </g>

          {/* beam emitter glow near the dish */}
          <g className="dishGlow">
            <circle cx="185" cy="-85" r="10" fill="#79ff8f" opacity="0.14" />
            <circle cx="185" cy="-85" r="4" fill="#d7ffe0" opacity="0.55" />
          </g>
        </g>

        {/* laser beam exits off-screen upper-right */}
        <g className="beam">
          <path
            d="M 38 200 L 860 -150"
            stroke="#79ff8f"
            strokeWidth="11"
            strokeLinecap="round"
            opacity="0.75"
          />
          <path
            d="M 38 200 L 860 -150"
            stroke="#baffe0"
            strokeWidth="4"
            strokeLinecap="round"
            opacity="0.92"
          />
          <path
            d="M 38 200 L 860 -150"
            stroke="#f3fff7"
            strokeWidth="1.5"
            strokeLinecap="round"
            opacity="0.95"
          />
        </g>

        {/* title */}
        <text
          x="420"
          y="405"
          textAnchor="middle"
          fill="#dbe1ea"
          fontSize="34"
          fontWeight="700"
          letterSpacing="5"
          style={{ fontFamily: "system-ui, sans-serif" }}
        >
          DEATH STAR BATTLES
        </text>

        {/* subtle scanline overlay */}
        <g opacity="0.03">
          {Array.from({ length: 38 }).map((_, i) => (
            <rect key={i} x="0" y={i * 12} width="800" height="6" fill="#ffffff" />
          ))}
        </g>
      </svg>
    </LoadingContainer>
  )
}