import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { User, Loader2, AlertCircle } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { loginUser, clearError } from "@/store/slices/authSlice";

const Login = () => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const { toast } = useToast();
  
  const { isAuthenticated, loading, error } = useAppSelector(state => state.auth);
  
  const [credentials, setCredentials] = useState({
    email: "",
    password: ""
  });

  // ✅ Zaten giriş yapılmışsa dashboard'a yönlendir
  useEffect(() => {
    if (isAuthenticated) {
      navigate('/');
    }
  }, [isAuthenticated, navigate]);

  // ✅ Error toast
  useEffect(() => {
    if (error) {
      toast({
        title: "Giriş Hatası",
        description: error,
        variant: "destructive"
      });
      dispatch(clearError());
    }
  }, [error, toast, dispatch]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!credentials.email || !credentials.password) {
      toast({
        title: "Hata",
        description: "Lütfen e-posta ve şifre alanlarını doldurun",
        variant: "destructive"
      });
      return;
    }

    console.log("Login attempt:", credentials.email);
    
    try {
      const result = await dispatch(loginUser(credentials));
      
      if (loginUser.fulfilled.match(result)) {
        toast({
          title: "Giriş Başarılı",
          description: "Hoş geldiniz!",
        });
        navigate('/');
      }
    } catch (error) {
      console.error('Login error:', error);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl font-bold text-gray-800">
            İntranet Sistemi Girişi
          </CardTitle>
          <CardDescription>
            Sistemde giriş yapın
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleLogin} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">E-posta</Label>
              <Input
                id="email"
                type="email"
                placeholder="ornek@sirket.com"
                value={credentials.email}
                onChange={(e) => setCredentials({...credentials, email: e.target.value})}
                disabled={loading}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Şifre</Label>
              <Input
                id="password"
                type="password"
                placeholder="••••••••"
                value={credentials.password}
                onChange={(e) => setCredentials({...credentials, password: e.target.value})}
                disabled={loading}
                required
              />
            </div>
            <Button 
              type="submit" 
              className="w-full bg-blue-600 hover:bg-blue-700"
              disabled={loading}
            >
              {loading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Giriş Yapılıyor...
                </>
              ) : (
                <>
                  <User className="mr-2 h-4 w-4" />
                  Giriş Yap
                </>
              )}
            </Button>
          </form>

          {/* ✅ Error Display */}
          {error && (
            <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-md flex items-center gap-2">
              <AlertCircle className="h-4 w-4 text-red-500" />
              <span className="text-sm text-red-700">{error}</span>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default Login;
