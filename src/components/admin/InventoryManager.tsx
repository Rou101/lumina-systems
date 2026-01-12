import React, { useState } from 'react';
import { GlassButton } from '../../components/GlassUI';
import { useTranslation } from 'react-i18next';
import { Product } from '../../types';
import { updateProductStock, toggleProductAvailability, downloadCSVTemplate } from '../../services/dataService';

interface InventoryManagerProps {
    products: Product[];
}

export const InventoryManager: React.FC<InventoryManagerProps> = ({ products }) => {
    const { t } = useTranslation();
    const [invSearch, setInvSearch] = useState('');
    const [invFilter, setInvFilter] = useState('all');

    const filteredProducts = products.filter(p => {
        const matchesSearch = p.name.toLowerCase().includes(invSearch.toLowerCase());
        const matchesCat = invFilter === 'all' || p.category === invFilter;
        return matchesSearch && matchesCat;
    });

    const categories = Array.from(new Set(products.map(p => p.category)));

    const handleStockChange = (id: string, val: string) => {
        const num = parseInt(val);
        if (!isNaN(num)) updateProductStock(id, num);
    };

    return (
        <div className="space-y-8 animate-fade-in-up">
            <div className="flex flex-col md:flex-row justify-between items-end border-b border-lumina-border pb-4 gap-4">
                <div>
                    <h2 className="text-xl font-bold uppercase text-lumina-text-primary">{t('inventory_title')}</h2>
                    <p className="text-xs text-lumina-text-secondary font-mono">{t('inventory_subtitle')}</p>
                </div>

                {/* SMART CONTROLS */}
                <div className="flex flex-1 gap-2 w-full md:w-auto">
                    <div className="relative flex-1">
                        <span className="absolute left-3 top-2 text-lumina-text-secondary">🔍</span>
                        <input
                            placeholder={t('inventory_search_placeholder')}
                            className="w-full bg-lumina-panel border border-lumina-border pl-10 pr-4 py-2 text-white text-xs font-bold uppercase outline-none focus:border-lumina-cyan"
                            value={invSearch}
                            onChange={e => setInvSearch(e.target.value)}
                        />
                    </div>
                    <select
                        className="bg-lumina-panel border border-lumina-border px-4 py-2 text-white text-xs font-bold uppercase outline-none focus:border-lumina-cyan"
                        value={invFilter}
                        onChange={e => setInvFilter(e.target.value)}
                    >
                        <option value="all">{t('inventory_all_categories')}</option>
                        {categories.map(c => <option key={c} value={c}>{c}</option>)}
                    </select>
                </div>

                <div className="flex gap-2">
                    <GlassButton onClick={downloadCSVTemplate} variant="secondary" className="px-4 py-2 text-[10px]">{t('inventory_template')}</GlassButton>
                    <label className="bg-lumina-cyan text-black px-4 py-2 text-[10px] font-bold uppercase cursor-pointer hover:bg-white transition-colors">
                        {t('inventory_import')}
                        <input type="file" className="hidden" />
                    </label>
                </div>
            </div>

            <div className="bg-lumina-panel border border-lumina-border rounded-sm overflow-hidden">
                <table className="w-full text-left border-collapse">
                    <thead className="bg-lumina-border/20 text-lumina-text-secondary text-[10px] font-mono uppercase">
                        <tr>
                            <th className="p-3">{t('col_product')}</th>
                            <th className="p-3">{t('col_category')}</th>
                            <th className="p-3">{t('col_cost')}</th>
                            <th className="p-3">{t('col_price')}</th>
                            <th className="p-3">{t('col_stock')}</th>
                            <th className="p-3 text-center">{t('col_status')}</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-lumina-border/30 text-xs text-white">
                        {filteredProducts.map(product => (
                            <tr key={product.id} className="group hover:bg-lumina-cyan/5">
                                <td className="p-3 font-bold text-lumina-text-primary flex items-center gap-2">
                                    {product.imageUrl && <img src={product.imageUrl} className="w-6 h-6 object-cover rounded-sm border border-white/10" />}
                                    {product.name}
                                </td>
                                <td className="p-3 text-lumina-text-secondary">{product.category}</td>
                                <td className="p-3 text-lumina-text-muted font-mono">${product.cost}</td>
                                <td className="p-3 text-lumina-cyan font-mono font-bold">${product.price}</td>
                                <td className="p-3">
                                    <input
                                        type="number"
                                        defaultValue={product.stock}
                                        onBlur={(e) => handleStockChange(product.id, e.target.value)}
                                        className={`
                                                        border w-20 px-2 py-1 text-center font-bold outline-none transition-colors
                                                        ${product.stock < 10 ? 'bg-red-500/20 border-red-500 text-red-500' : 'bg-black/30 border-lumina-border text-white focus:border-lumina-cyan'}
                                                    `}
                                    />
                                </td>
                                <td className="p-3 text-center">
                                    <button
                                        onClick={() => toggleProductAvailability(product.id)}
                                        className={`
                                                 px-3 py-1 text-[9px] uppercase font-bold border rounded-sm transition-all
                                                 ${product.isAvailable ? 'border-emerald-500/50 text-emerald-500 bg-emerald-500/10 hover:bg-red-500/10 hover:text-red-500 hover:border-red-500' : 'border-red-500/50 text-red-500 bg-red-500/10 hover:bg-emerald-500/10 hover:text-emerald-500 hover:border-emerald-500'}
                                             `}
                                    >
                                        {product.isAvailable ? t('status_active') : t('status_offline')}
                                    </button>
                                </td>
                            </tr>
                        ))}
                        {filteredProducts.length === 0 && (
                            <tr>
                                <td colSpan={6} className="p-8 text-center text-white/30 font-mono italic">
                                    {t('inventory_no_matches')}
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
};
