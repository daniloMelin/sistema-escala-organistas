import React from 'react';
import PropTypes from 'prop-types';
import Button from './ui/Button';

const ChurchList = ({
  churches,
  isLoading,
  onChurchSelect,
  onStartEdit,
  onRequestDeleteChurch,
}) => {
  return (
    <>
      <h3>Igrejas Cadastradas:</h3>
      <ul style={{ listStyle: 'none', padding: 0 }}>
        {churches.map((church) => (
          <li
            key={church.id}
            onClick={() => onChurchSelect(church)}
            style={{
              border: '1px solid #eee',
              padding: '15px',
              marginBottom: '10px',
              borderRadius: '4px',
              cursor: 'pointer',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              background: 'white',
              boxShadow: '0 2px 4px rgba(0,0,0,0.02)',
            }}
          >
            <div>
              <strong style={{ fontSize: '1.1em', color: '#0056b3' }}>{church.name}</strong>
              <br />
              {church.code && <small style={{ color: '#666' }}>Código: {church.code}</small>}
            </div>
            <div style={{ display: 'flex', gap: '10px' }}>
              <Button
                onClick={(e) => onStartEdit(e, church)}
                disabled={isLoading}
                variant="warning"
                style={{ fontSize: '12px', padding: '6px 12px' }}
              >
                Editar
              </Button>
              <Button
                onClick={(e) => onRequestDeleteChurch(e, church.id, church.name)}
                disabled={isLoading}
                variant="danger"
                style={{ fontSize: '12px', padding: '6px 12px' }}
              >
                Excluir
              </Button>
            </div>
          </li>
        ))}
      </ul>
    </>
  );
};

ChurchList.propTypes = {
  churches: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.string.isRequired,
      name: PropTypes.string.isRequired,
      code: PropTypes.string,
      config: PropTypes.object,
    })
  ).isRequired,
  isLoading: PropTypes.bool.isRequired,
  onChurchSelect: PropTypes.func.isRequired,
  onStartEdit: PropTypes.func.isRequired,
  onRequestDeleteChurch: PropTypes.func.isRequired,
};

export default ChurchList;
