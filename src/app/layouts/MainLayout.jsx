import React, { useState } from 'react';
import { Outlet } from 'react-router-dom';
import { Navbar } from '../../shared/components/navigation/Navbar.jsx';
import { Footer } from '../../shared/components/navigation/Footer.jsx';
import { CartDrawer } from '../../features/cart/components/CartDrawer.jsx';
import { BranchModal } from '../../features/branches/components/BranchModal.jsx';

export const MainLayout = () => {
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isBranchModalOpen, setIsBranchModalOpen] = useState(false);

  return (
    <div className="min-h-screen w-full max-w-full flex flex-col bg-slate-50 text-slate-900 overflow-x-hidden">
      <Navbar
        onOpenCart={() => setIsCartOpen(true)}
        onOpenBranchModal={() => setIsBranchModalOpen(true)}
      />

      <main className="flex-1 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-10 flex flex-col min-w-0">
        <Outlet context={{ openCart: () => setIsCartOpen(true), openBranchModal: () => setIsBranchModalOpen(true) }} />
      </main>

      <Footer />

      {/* Drawer del Carrito */}
      <CartDrawer isOpen={isCartOpen} onClose={() => setIsCartOpen(false)} />

      {/* Modal para Cambiar Sucursal */}
      <BranchModal isOpen={isBranchModalOpen} onClose={() => setIsBranchModalOpen(false)} />
    </div>
  );
};
