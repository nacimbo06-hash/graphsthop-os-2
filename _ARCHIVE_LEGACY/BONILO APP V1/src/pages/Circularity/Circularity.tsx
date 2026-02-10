import React, { useState, useEffect } from 'react';
import { Package, Smartphone, QrCode, TrendingDown, Leaf, AlertCircle } from 'lucide-react';
import { dbService } from '../../services/dbService';

export default function CircularityPage() {
    const [surplusItems, setSurplusItems] = useState<any[]>([]);

    useEffect(() => {
        loadSurplus();
    }, []);

    async function loadSurplus() {
        const products = await dbService.get('products');
        // Roadmap Logic: Items expiring in < 48h are candidates for Circularity
        const expiring = products.filter((p: any) => {
            if (!p.expiryDate) return false;
            const diff = new Date(p.expiryDate).getTime() - Date.now();
            return diff > 0 && diff < 48 * 60 * 60 * 1000;
        });
        setSurplusItems(expiring);
    }

    return (
        <div className="p-8 space-y-8 bg-[var(--background)] min-h-screen">
            <header className="flex justify-between items-center">
                <div>
                    <h1 className="text-3xl font-semibold text-[var(--primary)] flex items-center gap-3">
                        <Leaf className="w-8 h-8" />
                        Circularity & Food Rescue
                    </h1>
                    <p className="text-[var(--text-secondary)] mt-1">2026 Strategic Ecosystem: Converting Waste to Revenue</p>
                </div>
                <div className="bg-[var(--secondary)] p-4 rounded-2xl flex gap-6">
                    <div className="text-center">
                        <p className="text-xs uppercase tracking-wider text-[var(--primary)] font-medium">CO2 Saved</p>
                        <p className="text-2xl font-bold text-[var(--primary)]">12.4kg</p>
                    </div>
                    <div className="text-center">
                        <p className="text-xs uppercase tracking-wider text-[var(--primary)] font-medium">Revenue Rescued</p>
                        <p className="text-2xl font-bold text-[var(--primary)]">4,500 DA</p>
                    </div>
                </div>
            </header>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {/* Surplus Alerts */}
                <section className="col-span-2 space-y-4">
                    <h2 className="text-xl font-medium flex items-center gap-2">
                        <AlertCircle className="w-5 h-5 text-[var(--accent)]" />
                        Critical Surplus Alerts
                    </h2>
                    <div className="grid grid-cols-1 gap-4">
                        {surplusItems.length > 0 ? surplusItems.map(item => (
                            <div key={item.id} className="bg-white p-6 rounded-2xl shadow-sm border border-[var(--border)] flex justify-between items-center">
                                <div className="flex gap-4 items-center">
                                    <div className="bg-[var(--secondary)] p-3 rounded-xl text-2xl">{item.emoji || '📦'}</div>
                                    <div>
                                        <h3 className="font-semibold">{item.name}</h3>
                                        <p className="text-sm text-red-500 font-medium">Expiring in {Math.round((new Date(item.expiryDate!).getTime() - Date.now()) / (1000 * 60 * 60))} hours</p>
                                    </div>
                                </div>
                                <div className="flex gap-3">
                                    <button className="px-4 py-2 rounded-full border border-[var(--primary)] text-[var(--primary)] text-sm font-medium hover:bg-[var(--secondary)] transition-colors">
                                        Mark Down 50%
                                    </button>
                                    <button className="px-4 py-2 rounded-full bg-[var(--primary)] text-white text-sm font-medium shadow-lg shadow-[var(--primary)]/20 hover:scale-105 transition-transform">
                                        Create Surprise Bag
                                    </button>
                                </div>
                            </div>
                        )) : (
                            <div className="p-12 text-center bg-white rounded-2xl border border-dashed border-[var(--border)]">
                                <Package className="w-12 h-12 mx-auto text-[var(--muted-foreground)] opacity-20 mb-4" />
                                <p className="text-[var(--text-secondary)]">No critical surplus detected. Your inventory is lean!</p>
                            </div>
                        )}
                    </div>
                </section>

                {/* Dashboard Widgets */}
                <aside className="space-y-6">
                    <div className="bg-[var(--primary)] text-white p-6 rounded-3xl shadow-xl space-y-4">
                        <div className="flex justify-between items-start">
                            <h3 className="font-medium text-lg">Active Rescue</h3>
                            <Smartphone className="w-5 h-5 opacity-70" />
                        </div>
                        <div className="space-y-3">
                            <div className="bg-white/10 p-4 rounded-2xl flex justify-between items-center">
                                <span>Surprise Bag #01</span>
                                <span className="bg-white text-[var(--primary)] text-[10px] px-2 py-1 rounded-full font-bold">LIVE</span>
                            </div>
                            <div className="bg-white/10 p-4 rounded-2xl flex justify-between items-center">
                                <span>Surprise Bag #02</span>
                                <span className="text-xs opacity-60 italic">Reserved</span>
                            </div>
                        </div>
                        <button className="w-full py-3 bg-white text-[var(--primary)] rounded-2xl font-semibold flex items-center justify-center gap-2 hover:bg-opacity-90 transition-all">
                            <QrCode className="w-4 h-4" />
                            Scan Pickup
                        </button>
                    </div>

                    <div className="bg-white p-6 rounded-3xl border border-[var(--border)] space-y-4">
                        <h3 className="font-medium flex items-center gap-2">
                            <TrendingDown className="w-4 h-4" />
                            Waste Trends
                        </h3>
                        <div className="h-40 flex items-end gap-2 justify-around">
                            {[40, 70, 45, 90, 65, 30].map((h, i) => (
                                <div key={i} className="w-full bg-[var(--secondary)] rounded-t-lg relative group" style={{ height: `${h}%` }}>
                                    <div className="absolute -top-6 left-1/2 -translate-x-1/2 text-[10px] opacity-0 group-hover:opacity-100 transition-opacity font-bold">{h}%</div>
                                </div>
                            ))}
                        </div>
                        <p className="text-[10px] text-center text-[var(--text-muted)] uppercase tracking-widest">Last 6 Months Efficiency</p>
                    </div>
                </aside>
            </div>
        </div>
    );
}
