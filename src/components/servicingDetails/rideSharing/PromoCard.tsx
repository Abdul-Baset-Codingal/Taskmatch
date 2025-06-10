const PromoCard = () => {
  return (
    <div className="w-full max-w-3xl mx-auto bg-white text-[#2A3B8F] rounded-xl shadow-xl p-5 mb-40">
      <div className="flex items-center gap-4">
        {/* Icon */}
        <div className="text-5xl">💰</div>

        {/* Text */}
        <div>
          <h3 className="text-xl font-bold mb-1">Limited time offer</h3>
          <p className="text-sm mb-2">Use code:</p>

          {/* Code Box */}
          <div className="bg-[#7F5AF0] text-white px-4 py-2 rounded-lg inline-block font-semibold tracking-wide shadow-md mb-3">
            FIRSTRIDE
          </div>

          <p className="text-sm leading-relaxed">
            Get <span className="font-bold text-[#7F5AF0]">$10 off</span> your first ride
            when using our mobile app!
          </p>
        </div>
      </div>
    </div>
  );
};

export default PromoCard;
