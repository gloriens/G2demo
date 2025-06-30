
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { User, Shield } from "lucide-react";

const Login = () => {
  const [employeeCredentials, setEmployeeCredentials] = useState({
    email: "",
    password: ""
  });

  const [hrCredentials, setHrCredentials] = useState({
    email: "",
    password: ""
  });

  const handleEmployeeLogin = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Employee Login:", employeeCredentials);
    // Burada giriş işlemi yapılacak
  };

  const handleHrLogin = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("HR Login:", hrCredentials);
    // Burada İK giriş işlemi yapılacak
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl font-bold text-gray-800">İK Sistemi Girişi</CardTitle>
          <CardDescription>
            Çalışan veya İK personeli olarak giriş yapın
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="employee" className="w-full">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="employee" className="flex items-center gap-2">
                <User className="w-4 h-4" />
                Çalışan
              </TabsTrigger>
              <TabsTrigger value="hr" className="flex items-center gap-2">
                <Shield className="w-4 h-4" />
                İK Personeli
              </TabsTrigger>
            </TabsList>

            <TabsContent value="employee">
              <form onSubmit={handleEmployeeLogin} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="employee-email">E-posta</Label>
                  <Input
                    id="employee-email"
                    type="email"
                    placeholder="ornek@sirket.com"
                    value={employeeCredentials.email}
                    onChange={(e) => setEmployeeCredentials({...employeeCredentials, email: e.target.value})}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="employee-password">Şifre</Label>
                  <Input
                    id="employee-password"
                    type="password"
                    value={employeeCredentials.password}
                    onChange={(e) => setEmployeeCredentials({...employeeCredentials, password: e.target.value})}
                    required
                  />
                </div>
                <Button type="submit" className="w-full bg-blue-600 hover:bg-blue-700">
                  Çalışan Girişi
                </Button>
              </form>
            </TabsContent>

            <TabsContent value="hr">
              <form onSubmit={handleHrLogin} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="hr-email">E-posta</Label>
                  <Input
                    id="hr-email"
                    type="email"
                    placeholder="ik@sirket.com"
                    value={hrCredentials.email}
                    onChange={(e) => setHrCredentials({...hrCredentials, email: e.target.value})}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="hr-password">Şifre</Label>
                  <Input
                    id="hr-password"
                    type="password"
                    value={hrCredentials.password}
                    onChange={(e) => setHrCredentials({...hrCredentials, password: e.target.value})}
                    required
                  />
                </div>
                <Button type="submit" className="w-full bg-green-600 hover:bg-green-700">
                  İK Personeli Girişi
                </Button>
              </form>
            </TabsContent>
          </Tabs>

          <div className="mt-6 text-center text-sm text-gray-600">
            <p>Şifrenizi mi unuttunuz? <a href="#" className="text-blue-600 hover:underline">Sıfırla</a></p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Login;
