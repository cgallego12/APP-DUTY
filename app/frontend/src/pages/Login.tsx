import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { BarChart3, Lock, Eye, ShieldCheck } from 'lucide-react';

interface LoginProps {
  onLogin: () => void;
}

const Login: React.FC<LoginProps> = ({ onLogin }) => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 flex items-center justify-center p-4">
      <div className="max-w-md w-full">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br from-blue-500 to-cyan-500 mb-4 shadow-lg shadow-blue-500/25">
            <BarChart3 className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-3xl font-bold text-white mb-2">Skyfree Shop Analytics</h1>
          <p className="text-slate-400">Panel de análisis Duty Free</p>
        </div>

        <Card className="bg-slate-900/80 border-slate-800 backdrop-blur-sm">
          <CardContent className="pt-6 space-y-6">
            <div className="text-center">
              <Lock className="w-10 h-10 text-blue-400 mx-auto mb-3" />
              <h2 className="text-xl font-semibold text-white mb-2">Acceso restringido</h2>
              <p className="text-sm text-slate-400">
                Inicia sesión para acceder al dashboard. Los permisos se asignan por rol:
              </p>
            </div>

            <div className="space-y-3">
              <div className="flex items-start gap-3 p-3 rounded-lg bg-slate-800/50 border border-slate-700">
                <ShieldCheck className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
                <div>
                  <p className="text-sm font-medium text-white">Administrador</p>
                  <p className="text-xs text-slate-400">Puede cargar archivos Excel y ver todos los dashboards.</p>
                </div>
              </div>
              <div className="flex items-start gap-3 p-3 rounded-lg bg-slate-800/50 border border-slate-700">
                <Eye className="w-5 h-5 text-blue-400 shrink-0 mt-0.5" />
                <div>
                  <p className="text-sm font-medium text-white">Visualizador</p>
                  <p className="text-xs text-slate-400">Solo puede consultar los dashboards con los datos más recientes.</p>
                </div>
              </div>
            </div>

            <Button
              onClick={onLogin}
              className="w-full bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 text-white"
              size="lg"
            >
              Iniciar sesión
            </Button>

            <p className="text-xs text-center text-slate-500">
              El primer usuario registrado recibe automáticamente el rol de administrador.
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Login;