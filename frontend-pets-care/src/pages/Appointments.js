import React from 'react';
import AppointmentForm from '../components/Appointment/AppointmentForm';
import AppointmentList from '../components/Appointment/AppointmentList';
import '../styles/Appointments.css';

const Appointments = () => {
  return (
    <div className="appointments-page">
      <div className="appointments-container">
        <div className="appointments-new">
          <AppointmentForm />
        </div>
        <div className="appointments-existing">
          <AppointmentList />
        </div>
      </div>
    </div>
  );
};

export default Appointments;