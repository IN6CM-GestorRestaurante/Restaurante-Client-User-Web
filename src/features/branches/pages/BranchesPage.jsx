import React, { useEffect } from 'react';
import { MapPin } from 'lucide-react';
import { useBranchStore } from '../store/branchStore.js';
import { BranchCard } from '../components/BranchCard.jsx';
import { Spinner } from '../../../shared/components/ui/Spinner.jsx';
import toast from 'react-hot-toast';

export const BranchesPage = () => {
  const { branches, selectedBranch, setSelectedBranch, fetchBranches, loading, error } = useBranchStore();

  useEffect(() => {
    fetchBranches();
  }, [fetchBranches]);

  const handleSelect = (branch) => {
    setSelectedBranch(branch);
    toast.success(`Sucursal activa: ${branch.name || branch.nombre}`);
  };

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <span className="inline-block px-2.5 py-1 rounded-full bg-blue-50 text-blue-700 font-bold text-xs mb-2">
            Nuestras Ubicaciones
          </span>
          <h1 className="font-heading font-extrabold text-2xl sm:text-3xl text-slate-800">
            Sucursales del Restaurante
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Encuentra la sucursal ideal para reservar mesa o solicitar tus platillos favoritos.
          </p>
        </div>
      </div>

      {loading ? (
        <div className="py-16 flex flex-col items-center justify-center gap-3">
          <Spinner size="xl" color="text-emerald-500" />
          <p className="text-sm text-slate-500 font-medium">Cargando sucursales...</p>
        </div>
      ) : error ? (
        <div className="bg-red-50 border border-red-200 rounded-2xl p-6 text-center text-red-700 text-sm">
          Error: {error}
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {branches.map((branch, idx) => {
            const branchId = branch._id || branch.id || idx;
            const selectedId = selectedBranch?._id || selectedBranch?.id;
            return (
              <BranchCard
                key={branchId}
                branch={branch}
                isSelected={selectedId === branchId}
                onSelect={handleSelect}
              />
            );
          })}
        </div>
      )}
    </div>
  );
};
