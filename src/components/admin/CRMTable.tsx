import React, { useState } from 'react';
import { GlassButton } from '../../components/GlassUI';
import { downloadCustomersCSVTemplate } from '../../services/dataService';
import { Customer } from '../../types'; // Assuming Customer is exported
import { useTranslation } from 'react-i18next';

interface CRMTableProps {
    customers: Customer[];
}

export const CRMTable: React.FC<CRMTableProps> = ({ customers }) => {
    const { t } = useTranslation();
    const [crmSearch, setCrmSearch] = useState('');

    const filteredCustomers = customers.filter(c => c.name.toLowerCase().includes(crmSearch.toLowerCase()));

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-end border-b border-lumina-border pb-4">
                <div>
                    <h2 className="text-xl font-bold uppercase text-lumina-text-primary">{t('crm_title')}</h2>
                    <p className="text-xs text-lumina-text-secondary font-mono">{t('crm_subtitle')}</p>
                </div>
                <div className="flex gap-2">
                    <GlassButton onClick={downloadCustomersCSVTemplate} variant="secondary" className="h-8 py-0 text-[10px]">{t('crm_btn_template')}</GlassButton>
                </div>
            </div>

            <div className="grid md:grid-cols-4 gap-4">
                <input
                    placeholder={t('crm_ph_search')}
                    value={crmSearch}
                    onChange={(e) => setCrmSearch(e.target.value)}
                    className="md:col-span-3 bg-lumina-panel border border-lumina-border p-3 text-lumina-text-primary font-mono text-sm focus:border-lumina-cyan outline-none rounded-sm uppercase"
                />
                <GlassButton onClick={() => { }} className="w-full">{t('crm_btn_filter')}</GlassButton>
            </div>

            <div className="border border-lumina-border bg-lumina-panel rounded-sm overflow-hidden">
                <table className="w-full text-left font-mono text-xs">
                    <thead className="bg-lumina-border/30 text-lumina-text-secondary">
                        <tr>
                            <th className="p-3 uppercase tracking-wider">{t('col_name')}</th>
                            <th className="p-3 uppercase tracking-wider">{t('col_segment')}</th>
                            <th className="p-3 uppercase tracking-wider">{t('col_group_id')}</th>
                            <th className="p-3 uppercase tracking-wider text-right">{t('col_ltv')}</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-lumina-border/30">
                        {filteredCustomers.map(c => (
                            <tr key={c.id} className="hover:bg-lumina-cyan/5 text-lumina-text-primary">
                                <td className="p-3 font-bold">{c.name}</td>
                                <td className="p-3"><span className="text-lumina-cyan bg-lumina-cyan/10 px-1 border border-lumina-cyan/20">{c.segment}</span></td>
                                <td className="p-3 text-yellow-500">{c.externalGroupId || t('common_na')}</td>
                                <td className="p-3 text-right">${c.totalSpent}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};
