import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { RecentLoans } from './recent-loans';
import { LoanTermsChart } from './loan-terms-charts';
import { DollarSign, Users, Building } from 'lucide-react';
import Image from 'next/image';
import { useAuth } from "@/lib/authContext";
import useEffect from "react"
export default function DashboardPage() {
    const {user}=useAuth();
    const router=useRouter();
    useEffect(()=>{
        if(!user){
            router.push('/login')
        }
    },[user,router])
    if (!user){
        return <div>Loading...</div>;
    }
    return (
        <>
            <div className='md:hidden'>
                <Image src='/examples/dashboard-light.png' width={1280} height={866} alt='Dashboard' className='block dark:hidden' />
                <Image src='/examples/dashboard-dark.png' width={1280} height={866} alt='Dashboard' className='hidden dark:block' />
            </div>
            <div className='hidden flex-col md:flex'>
                <div className='flex-1 space-y-4 p-8 pt-6'>
                    <div className='flex items-center justify-between space-y-2'>
                        <h2 className='text-3xl font-bold tracking-tight'>Dashboard</h2>
                    </div>
                    <Tabs defaultValue='overview' className='space-y-4'>
                        <TabsList>
                            <TabsTrigger value='overview'>Overview</TabsTrigger>
                            <TabsTrigger value='analytics' disabled>
                                Analytics
                            </TabsTrigger>
                            <TabsTrigger value='reports' disabled>
                                Reports
                            </TabsTrigger>
                            <TabsTrigger value='notifications' disabled>
                                Notifications
                            </TabsTrigger>
                        </TabsList>
                        <TabsContent value='overview' className='space-y-4'>
                            <div className='grid gap-4 md:grid-cols-2 lg:grid-cols-4'>
                                <Card>
                                    <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
                                        <CardTitle className='text-sm font-medium'>Total Loans</CardTitle>
                                        <DollarSign className='h-4 w-4 text-muted-foreground' />
                                    </CardHeader>
                                    <CardContent>
                                        <div className='text-2xl font-bold'>156</div>
                                        <p className='text-xs text-muted-foreground'>+2% from last month</p>
                                    </CardContent>
                                </Card>
                                <Card>
                                    <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
                                        <CardTitle className='text-sm font-medium'>Active Loans</CardTitle>
                                        <DollarSign className='h-4 w-4 text-muted-foreground' />
                                    </CardHeader>
                                    <CardContent>
                                        <div className='text-2xl font-bold'>124</div>
                                        <p className='text-xs text-muted-foreground'>+12 since last week</p>
                                    </CardContent>
                                </Card>
                                <Card>
                                    <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
                                        <CardTitle className='text-sm font-medium'>Total Employees</CardTitle>
                                        <Users className='h-4 w-4 text-muted-foreground' />
                                    </CardHeader>
                                    <CardContent>
                                        <div className='text-2xl font-bold'>23</div>
                                        <p className='text-xs text-muted-foreground'>+4 new this month</p>
                                    </CardContent>
                                </Card>
                                <Card>
                                    <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
                                        <CardTitle className='text-sm font-medium'>Active Branches</CardTitle>
                                        <Building className='h-4 w-4 text-muted-foreground' />
                                    </CardHeader>
                                    <CardContent>
                                        <div className='text-2xl font-bold'>7</div>
                                        <p className='text-xs text-muted-foreground'>+1 new branch</p>
                                    </CardContent>
                                </Card>
                            </div>
                            <div className='grid gap-4 md:grid-cols-2 lg:grid-cols-7'>
                                <Card className='col-span-4'>
                                    <CardHeader>
                                        <CardTitle>Loan Terms Overview</CardTitle>
                                    </CardHeader>
                                    <CardContent className='pl-2'>
                                        <LoanTermsChart />
                                    </CardContent>
                                </Card>
                                <Card className='col-span-3'>
                                    <CardHeader>
                                        <CardTitle>Recent Loans</CardTitle>
                                        <CardDescription>There have been 12 loans approved in the last 7 days.</CardDescription>
                                    </CardHeader>
                                    <CardContent>
                                        <RecentLoans />
                                    </CardContent>
                                </Card>
                            </div>
                        </TabsContent>
                    </Tabs>
                </div>
            </div>
        </>
    );
}
