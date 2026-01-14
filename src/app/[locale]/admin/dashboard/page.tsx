'use client';

import React, { useEffect, useState } from 'react';
import { getAdminData } from '../actions';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useTranslations } from 'next-intl';

export default function AdminDashboard() {
    const [data, setData] = useState<{ leads: any[], bookings: any[] }>({ leads: [], bookings: [] });
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function fetchData() {
            const result = await getAdminData();
            setData(result);
            setLoading(false);
        }
        fetchData();
    }, []);

    if (loading) return <div className="p-8">Loading dashboard...</div>;

    return (
        <div className="min-h-screen bg-slate-50 p-8">
            <h1 className="text-3xl font-bold text-slate-900 mb-8">Admin Dashboard</h1>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">

                {/* LEADS */}
                <Card>
                    <CardHeader>
                        <CardTitle>Recent Leads (Light Mode)</CardTitle>
                    </CardHeader>
                    <CardContent>
                        {data.leads.length === 0 ? (
                            <p className="text-slate-500">No leads yet.</p>
                        ) : (
                            <div className="overflow-x-auto">
                                <table className="w-full text-sm text-left">
                                    <thead className="text-xs text-slate-500 uppercase bg-slate-100">
                                        <tr>
                                            <th className="px-4 py-2">Name</th>
                                            <th className="px-4 py-2">Phone</th>
                                            <th className="px-4 py-2">Date</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {data.leads.map((lead: any) => (
                                            <tr key={lead.id} className="border-b">
                                                <td className="px-4 py-3 font-medium">{lead.name}</td>
                                                <td className="px-4 py-3 text-slate-500">{lead.phone}</td>
                                                <td className="px-4 py-3 text-slate-400 text-xs">{new Date(lead.createdAt).toLocaleDateString()}</td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        )}
                    </CardContent>
                </Card>

                {/* BOOKINGS */}
                <Card>
                    <CardHeader>
                        <CardTitle>Recent Bookings (Full Mode)</CardTitle>
                    </CardHeader>
                    <CardContent>
                        {data.bookings.length === 0 ? (
                            <p className="text-slate-500">No bookings yet.</p>
                        ) : (
                            <div className="overflow-x-auto">
                                <table className="w-full text-sm text-left">
                                    <thead className="text-xs text-slate-500 uppercase bg-slate-100">
                                        <tr>
                                            <th className="px-4 py-2">Patient</th>
                                            <th className="px-4 py-2">Treatment</th>
                                            <th className="px-4 py-2">Date/Time</th>
                                            <th className="px-4 py-2">Status</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {data.bookings.map((booking: any) => (
                                            <tr key={booking.id} className="border-b">
                                                <td className="px-4 py-3 font-medium">
                                                    {booking.patientName || 'Unknown'}<br />
                                                    <span className="text-xs text-slate-400">{booking.patientPhone}</span>
                                                </td>
                                                <td className="px-4 py-3 text-slate-600">{booking.treatmentName}</td>
                                                <td className="px-4 py-3 text-slate-500 whitespace-nowrap">
                                                    {booking.date}<br />{booking.time}
                                                </td>
                                                <td className="px-4 py-3">
                                                    <span className="px-2 py-1 rounded-full text-xs font-bold bg-green-100 text-green-700">
                                                        {booking.status}
                                                    </span>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        )}
                    </CardContent>
                </Card>

            </div>
        </div>
    );
}
