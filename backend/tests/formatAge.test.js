// tests/formatAge.test.js

// Fonction à tester
function formatAge(age) {
    if (age === null || age === undefined) return 'Non renseigné';
    
    if (age < 1) {
      const months = Math.round(age * 12);
      return months === 1 ? '1 mois' : `${months} mois`;
    }
    
    const years = Math.floor(age);
    const months = Math.round((age - years) * 12);
    
    if (months === 0) {
      return years === 1 ? '1 an' : `${years} ans`;
    }
    
    return `${years} ans et ${months} mois`;
  }
  
  // Tests unitaires
  describe('Tests de la fonction formatAge', () => {
    
    test('Devrait retourner "Non renseigné" pour les valeurs null ou undefined', () => {
      expect(formatAge(null)).toBe('Non renseigné');
      expect(formatAge(undefined)).toBe('Non renseigné');
    });
    
    test('Devrait formater correctement les âges inférieurs à 1 an', () => {
      expect(formatAge(0)).toBe('0 mois');
      expect(formatAge(0.08333)).toBe('1 mois');  // 1/12
      expect(formatAge(0.5)).toBe('6 mois');
      expect(formatAge(0.91666)).toBe('11 mois'); // 11/12
    });
    
    test('Devrait formater correctement les âges en années complètes', () => {
      expect(formatAge(1)).toBe('1 an');
      expect(formatAge(2)).toBe('2 ans');
      expect(formatAge(10)).toBe('10 ans');
    });
    
    test('Devrait formater correctement les âges avec années et mois', () => {
      expect(formatAge(1.25)).toBe('1 ans et 3 mois');
      expect(formatAge(2.5)).toBe('2 ans et 6 mois');
      expect(formatAge(3.91666)).toBe('3 ans et 11 mois');
    });
    
    test('Devrait gérer les cas limites', () => {
        expect(formatAge(0.999)).toBe('12 mois');
        expect(formatAge(1.001)).toBe('1 an');// Légère imprécision due aux arrondis
    });
  });