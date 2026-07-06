type TotalSellMADCardProps = {
    totalSellMAD: number
   
    };

export function TotalSellMADCard({ totalSellMAD }: TotalSellMADCardProps) {
    return (
        <article className="rounded-3xl border border-white/10 bg-slate-950/60 p-5 shadow-lg shadow-black/20">
            <p className="text-sm text-slate-200">💰 Total Sell</p>
            <p className="mt-3 text-3xl font-semibold text-white">{totalSellMAD.toFixed(2)} MAD</p>
            
        </article>
    );
}