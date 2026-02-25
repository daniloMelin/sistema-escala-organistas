import React from 'react';
import { renderHook } from '@testing-library/react';
import { ChurchProvider, useChurch } from '../contexts/ChurchContext';

describe('ChurchContext', () => {
  test('lança erro quando useChurch é usado fora de ChurchProvider', () => {
    expect(() => renderHook(() => useChurch())).toThrow(
      'useChurch deve ser usado dentro de ChurchProvider'
    );
  });

  test('fornece selectedChurch e setSelectedChurch dentro do provider', () => {
    const wrapper = ({ children }) => <ChurchProvider>{children}</ChurchProvider>;

    const { result } = renderHook(() => useChurch(), { wrapper });

    expect(result.current.selectedChurch).toBe(null);
    expect(typeof result.current.setSelectedChurch).toBe('function');
  });
});
