"use client"
import AttendanceRateChart from "@/app/components/charts/super-admin/AttendanceRateChart"
import ExpiringSchoolsTable from "@/app/components/charts/super-admin/ExpiringSchoolsTable"
import FeatureUsageChart from "@/app/components/charts/super-admin/FeatureUsageChart"
import FeeCollectionChart from "@/app/components/charts/super-admin/FeeCollectionChart"
import PlanUsageChart from "@/app/components/charts/super-admin/PlanUsageChart"
import RevenueChart from "@/app/components/charts/super-admin/RevenueChart"
import SchoolGrowthChart from "@/app/components/charts/super-admin/SchoolGrowthChart"
import StatsCards from "@/app/components/charts/super-admin/StatsCards"
import SubscriptionStatusChart from "@/app/components/charts/super-admin/SubscriptionStatusChart"

const SuperAdmin = () => {
    return (
        <div className=" overflow-x-auto " >
            <StatsCards />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                <SchoolGrowthChart />
                <RevenueChart />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
                <SubscriptionStatusChart />
                <PlanUsageChart />
                <FeatureUsageChart />
            </div>

            <div className=" my-10 flex items-center gap-x-10 " >
                {/* <div className=" w-full " >
                    <FeatureUsageChart />
                </div> */}
                <div className=" w-full " >
                    <AttendanceRateChart />
                </div>
                <div className=" w-full " >
                    <FeeCollectionChart />
                </div>
            </div>

            <div className=" my-10    " >
                <ExpiringSchoolsTable />
            </div>

        </div>
    )
}

export default SuperAdmin