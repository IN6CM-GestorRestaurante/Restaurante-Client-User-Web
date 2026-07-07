import React, { useState, useEffect } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { CheckCircle, XCircle, Mail, RefreshCw, ArrowLeft } from 'lucide-react';
import { verifyEmailRequest, resendVerificationRequest } from '../../../shared/api/auth.service.js';
import { Button } from '../../../shared/components/ui/Button.jsx';
import toast from 'react-hot-toast';

export const VerifyEmailPage = () => {
  const [searchParams] = useSearchParams();
  const token = searchParams.get('token');
  const [status, setStatus] = useState('VERIFYING'); // 'VERIFYING', 'SUCCESS', 'ERROR', 'NO_TOKEN'
  const [errorMessage, setErrorMessage] = useState('');
  const [resendEmail, setResendEmail] = useState('');
  const [resending, setResending] = useState(false);

  useEffect(() => {
    if (!token) {
      setStatus('NO_TOKEN');
      return;
    }
    const verify = async () => {
      try {
        const res = await verifyEmailRequest(token);
        if (res.data?.success || res.status === 200) {
          setStatus('SUCCESS');
          toast.success('¡Correo electrónico verificado con éxito!');
        } else {
          throw new Error(res.data?.message || 'Token de verificación no válido');
        }
      } catch (error) {
        setStatus('ERROR');
        setErrorMessage(error.response?.data?.message || error.message || 'El token de verificación ha expirado o no es válido');
      }
    };
    verify();
  }, [token]);

  const handleResend = async () => {
    if (!resendEmail) {
      toast.error('Por favor ingresa tu correo para re-enviar el enlace');
      return;
    }
    setResending(true);
    try {
      const res = await resendVerificationRequest(resendEmail);
      toast.success(res.data?.message || 'Enlace de verificación reenviado');
    } catch (error) {
      toast.error(error.response?.data?.message || error.message || 'Error al re-enviar');
    } finally {
      setResending(false);
    }
  };

  return (
    <div className="space-y-8 text-center max-w-md mx-auto">
      {status === 'VERIFYING' && (
        <div className="py-8 space-y-4">
          <RefreshCw className="w-12 h-12 text-blue-600 animate-spin mx-auto" />
          <h3 className="font-heading font-extrabold text-xl text-slate-800">Verificando tu correo electrónico...</h3>
          <p className="text-xs text-slate-500">Estamos validando tu cuenta con nuestros servidores gastronómicos.</p>
        </div>
      )}

      {status === 'SUCCESS' && (
        <div className="py-6 space-y-4">
          <CheckCircle className="w-16 h-16 text-emerald-500 mx-auto animate-bounce" />
          <h3 className="font-heading font-extrabold text-2xl text-slate-800">¡Cuenta Verificada con Éxito!</h3>
          <p className="text-sm text-slate-600">
            Ahora puedes iniciar sesión y acceder a todas las funcionalidades del restaurante, reservas y pedidos en línea.
          </p>
          <div className="pt-4">
            <Link
              to="/login"
              className="inline-flex items-center justify-center px-6 py-3 rounded-xl bg-emerald-500 text-white font-bold text-sm shadow-md shadow-emerald-500/20 hover:bg-emerald-600 transition-all w-full"
            >
              Ir a Iniciar Sesión
            </Link>
          </div>
        </div>
      )}

      {(status === 'ERROR' || status === 'NO_TOKEN') && (
        <div className="py-6 space-y-4">
          <XCircle className="w-16 h-16 text-red-500 mx-auto" />
          <h3 className="font-heading font-extrabold text-2xl text-slate-800">No se pudo verificar el correo</h3>
          <p className="text-xs text-red-600 font-medium bg-red-50 p-3 rounded-xl border border-red-100">
            {errorMessage || 'El enlace de verificación no fue proporcionado o ha expirado.'}
          </p>

          <div className="pt-4 space-y-3 bg-slate-50 p-4 rounded-2xl border border-slate-200">
            <label className="block text-xs font-bold text-slate-700 text-left">
              ¿Deseas reenviar un nuevo correo de verificación?
            </label>
            <div className="flex gap-2">
              <input
                type="email"
                placeholder="tu@correo.com"
                value={resendEmail}
                onChange={(e) => setResendEmail(e.target.value)}
                className="flex-1 bg-white border border-slate-200 rounded-xl px-3 py-2 text-xs focus:ring-2 focus:ring-blue-500 focus:outline-none"
              />
              <Button variant="blue" size="sm" onClick={handleResend} isLoading={resending}>
                Reenviar
              </Button>
            </div>
          </div>

          <div className="pt-2">
            <Link
              to="/login"
              className="inline-flex items-center gap-2 text-xs font-bold text-slate-500 hover:text-blue-600"
            >
              <ArrowLeft className="w-3.5 h-3.5" /> Volver al Inicio de Sesión
            </Link>
          </div>
        </div>
      )}
    </div>
  );
};
