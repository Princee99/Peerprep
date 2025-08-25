const colorClasses = {
  blue: {
    hoverBg: "hover:bg-blue-50/30",
    hoverShadow: "hover:shadow-blue-100/40",
    hoverText: "group-hover:text-blue-700",
    text: "text-blue-600",
    iconShadow: "group-hover:shadow-blue-300/40"
  },
  purple: {
    hoverBg: "hover:bg-purple-50/30",
    hoverShadow: "hover:shadow-purple-100/40",
    hoverText: "group-hover:text-purple-700",
    text: "text-purple-600",
    iconShadow: "group-hover:shadow-purple-300/40"
  },
  emerald: {
    hoverBg: "hover:bg-emerald-50/30",
    hoverShadow: "hover:shadow-emerald-100/40",
    hoverText: "group-hover:text-emerald-700",
    text: "text-emerald-600",
    iconShadow: "group-hover:shadow-emerald-300/40"
  },
};

const RoleCard = ({ color, title, description, buttonText, onClick, svg, gradient }) => {
  const c = colorClasses[color] || colorClasses.blue; // default fallback

  return (
    <div
      className={`group relative bg-white/70 backdrop-blur-sm rounded-3xl p-8 border border-white/50 cursor-pointer transition-all duration-500 hover:scale-105 ${c.hoverBg} hover:shadow-lg ${c.hoverShadow}`}
      onClick={onClick}
    >
      {/* Background gradient effect */}
      <div className={`absolute inset-0 ${gradient} rounded-3xl opacity-0 group-hover:opacity-20 transition-opacity duration-500`} />

      <div className="relative z-10">
        {/* Icon */}
        <div className={`w-20 h-20 mx-auto mb-6 ${gradient} rounded-2xl flex items-center justify-center shadow-md group-hover:shadow-lg ${c.iconShadow} transition-all duration-500`}>
          {svg}
        </div>

        {/* Title */}
        <h3 className={`text-2xl font-bold text-slate-800 mb-3 ${c.hoverText} transition-colors duration-300`}>
          {title}
        </h3>

        {/* Description */}
        <p className="text-slate-600 leading-relaxed mb-6 min-h-[4.5rem] flex items-center">
          {description}
        </p>

        {/* Button text */}
        <div className={`inline-flex items-center ${c.text} font-semibold group-hover:gap-3 gap-2 transition-all duration-300`}>
          <span>{buttonText}</span>
          <svg
            className="w-4 h-4 group-hover:translate-x-1 transition-transform duration-300"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </div>
      </div>
    </div>
  );
};

export default RoleCard;
