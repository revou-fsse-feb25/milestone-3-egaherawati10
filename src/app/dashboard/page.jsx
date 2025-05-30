'use client'

import React, { useEffect, useState } from "react";
import axios from "axios";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";
// import { Card, CardContent } from "@/component/ui/card";
export default function Dashboard() {
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function fetchData() {
            try {
                const res = await axios.get("https://api.escuelajs.co/api/v1/products");
                const products = res.data;

                const categoryCount = {};

                for (const product of products) {
                    const category = product
                    categoryCount[category] = (categoryCount[category] || 0) + 1;
                }

                const chartData = Object.entries(categoryCount).map(([category, count]) => ({ category, count, }));

                setData(chartData);
            } catch (error) {
                console.error("Error fetching data:", error);
            } finally {
                setLoading(false);
            }
        }

        fetchData();
    }, []);


    return (
        <div>
            <h1>Dashboard</h1>

            {loading? (
                <p>Loading...</p>
            ) : (
                <>
                <div>
                    {data.map((item) => (
                        <div key={item.category}>
                            <h2>{item.category}</h2>
                            <p>{item.count}</p>
                        </div>
                    ))}
                </div>
                
                <div>
                    <ResponsiveContainer>
                        <BarChart data={data}>
                            <XAxis dataKey="category" />
                            <YAxis />
                            <Tooltip />
                            <Bar dataKey="count" fill="#8884d8" />
                        </BarChart>
                    </ResponsiveContainer>
                </div>
                </>
            )}
        </div>
    )
}