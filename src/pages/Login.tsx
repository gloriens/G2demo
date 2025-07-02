
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
          <CardTitle className="text-2xl font-bold text-gray-800">İntranet Sistemi Girişi</CardTitle>
          <CardDescription>
          Siteme Giriş Yapın.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="employee" className="w-full">


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
                Giriş Yap
                </Button>
              </form>
            </TabsContent>

    

          </Tabs>


        </CardContent>
      </Card>
    </div>
  );
};

export default Login;
