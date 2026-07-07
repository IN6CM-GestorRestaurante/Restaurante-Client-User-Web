import React, { useEffect } from 'react';
import { Modal } from '../../../shared/components/ui/Modal.jsx';
import { Spinner } from '../../../shared/components/ui/Spinner.jsx';
import { BranchCard } from './BranchCard.jsx';
import { useBranchStore } from '../store/branchStore.js';
import toast from 'react-hot-toast';

export const BranchModal = ({ isOpen, onClose }) => {
  const { branches, selectedBranch, setSelectedBranch, fetchBranches, loading } = useBranchStore();

  useEffect(() => {
    if (isOpen && branches.length === 0) {
      fetchBranches();
    }
  }, [isOpen, branches.length, fetchBranches]);

  const handleSelect = (branch) => {
    setSelectedBranch(branch);
    toast.success(`Sucursal cambiada a: ${branch.name || branch.nombre || 'Seleccionada'}`, {
      icon: '📍',
      style: {
        borderRadius: '12px',
        background: '#10B981',
        color: '#fff',
      },
    });
    onClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="📍 Selecciona tu Sucursal Favorita"
      maxWidth="max-w-2xl"
    >
      <p className="text-xs text-slate-500 mb-4">
        Selecciona la sucursal más cercana o de tu preferencia para consultar el catálogo gastrónomico y disponibilidad de mesas en tiempo real.
      </p>

      {loading ? (
        <div className="py-12 flex flex-col items-center justify-center gap-3">
          <Spinner size="lg" color="text-emerald-500" />
          <p className="text-xs text-slate-400 font-medium">Buscando sucursales disponibles...</p>
        </div>
      ) : branches.length === 0 ? (
        <div className="py-10 text-center bg-slate-50 rounded-xl border border-slate-200">
          <p className="text-sm font-semibold text-slate-700">No se encontraron sucursales</p>
          <p className="text-xs text-slate-400 mt-1">Por favor intentalo de nuevo más tarde.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 max-h-[60vh] overflow-y-auto p-1">
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
    </Modal>
  );
};
