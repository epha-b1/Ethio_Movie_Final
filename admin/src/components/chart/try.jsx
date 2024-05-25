import React from 'react';
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';
import './chart.css';

const Dashboard = ({ movies }) => {
  
  const getMovieRatingsData = () => {
    return movies.map(movie => ({ name: movie.title, rating: movie.rating }));
  };

  const getGenreDistributionData = () => {
    const genreCount = {};
    movies.forEach(movie => {
      movie.genre.forEach(genre => {
        genreCount[genre] = (genreCount[genre] || 0) + 1;
      });
    });

    return Object.keys(genreCount).map(genre => ({
      name: genre,
      value: genreCount[genre],
    }));
  };

  const getMovieViewsData = () => {
    return movies.map(movie => ({ name: movie.title, views: movie.views.length }));
  };

  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042'];

  return (
    <div className="dashboard">
      <h2>Movie Dashboard</h2>

      <div className="chart-container">
        <h3>Movie Ratings</h3>
        <ResponsiveContainer width="100%" height={400}>
          <LineChart data={getMovieRatingsData()}>
            <XAxis dataKey="name" />
            <YAxis />
            <CartesianGrid stroke="#eee" strokeDasharray="5 5" />
            <Tooltip />
            <Legend />
            <Line type="monotone" dataKey="rating" stroke="#8884d8" />
          </LineChart>
        </ResponsiveContainer>
      </div>

      <div className="chart-container">
        <h3>Genre Distribution</h3>
        <ResponsiveContainer width="100%" height={400}>
          <PieChart>
            <Pie
              data={getGenreDistributionData()}
              dataKey="value"
              nameKey="name"
              cx="50%"
              cy="50%"
              outerRadius={150}
              fill="#8884d8"
              label
            >
              {getGenreDistributionData().map((entry, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
              ))}
            </Pie>
            <Tooltip />
            <Legend />
          </PieChart>
        </ResponsiveContainer>
      </div>

      <div className="chart-container">
        <h3>Movie Views</h3>
        <ResponsiveContainer width="100%" height={400}>
          <BarChart data={getMovieViewsData()}>
            <XAxis dataKey="name" />
            <YAxis />
            <CartesianGrid stroke="#eee" strokeDasharray="5 5" />
            <Tooltip />
            <Legend />
            <Bar dataKey="views" fill="#82ca9d" />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default Dashboard;
