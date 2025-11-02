'use client';

interface StatsCardProps {
  totalImages: number;
  todayImages: number;
  favoriteStyle: string;
  mostUsedRatio: string;
}

export default function StatsCard({ totalImages, todayImages, favoriteStyle, mostUsedRatio }: StatsCardProps) {
  return (
    <div className="neo-card bg-neo-green p-6 mb-8 fade-in">
      <h2 className="text-xl font-black uppercase mb-4">📊 Your Stats</h2>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="text-center">
          <div className="text-3xl font-black">{totalImages}</div>
          <div className="text-xs font-bold mt-1">Total Images</div>
        </div>
        <div className="text-center">
          <div className="text-3xl font-black">{todayImages}</div>
          <div className="text-xs font-bold mt-1">Today</div>
        </div>
        <div className="text-center">
          <div className="text-lg font-black">{favoriteStyle}</div>
          <div className="text-xs font-bold mt-1">Fav Style</div>
        </div>
        <div className="text-center">
          <div className="text-lg font-black">{mostUsedRatio}</div>
          <div className="text-xs font-bold mt-1">Fav Ratio</div>
        </div>
      </div>
    </div>
  );
}
