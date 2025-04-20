import React from 'react';
import { Head } from '@inertiajs/react';
import ThemeShowcase from '../../Components/Demo/ThemeShowcase';

const ThemeShowcasePage: React.FC = () => {
  return (
    <>
      <Head title="Theme Showcase - Fakevest" />
      <ThemeShowcase />
    </>
  );
};

export default ThemeShowcasePage;