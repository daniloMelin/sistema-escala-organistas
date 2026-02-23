import React from 'react';
import PropTypes from 'prop-types';
import Button from './ui/Button';

const OrganistList = ({ loading, organists, formatOrganistAvailability, onStartEdit, onRequestDeleteOrganist }) => {
  return (
    <>
      <h3>Organistas Cadastradas</h3>
      {loading ? (
        <p>Carregando dados...</p>
      ) : organists.length === 0 ? (
        <p>Nenhuma organista cadastrada.</p>
      ) : (
        <ul style={{ listStyle: 'none', padding: 0 }}>
          {organists.map((org) => (
            <li
              key={org.id}
              style={{
                padding: '15px',
                marginBottom: '10px',
                border: '1px solid #eee',
                borderRadius: '6px',
                background: 'white',
                boxShadow: '0 1px 3px rgba(0,0,0,0.05)',
              }}
            >
              <div
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  marginBottom: '5px',
                }}
              >
                <div>
                  <strong style={{ fontSize: '1.1em', color: '#333' }}>{org.name}</strong>
                </div>

                <div style={{ display: 'flex', gap: '10px' }}>
                  <Button onClick={() => onStartEdit(org)} variant="warning" style={{ fontSize: '12px', padding: '6px 10px' }}>
                    Editar
                  </Button>
                  <Button
                    onClick={() => onRequestDeleteOrganist(org.id, org.name)}
                    variant="danger"
                    style={{ fontSize: '12px', padding: '6px 10px' }}
                  >
                    Excluir
                  </Button>
                </div>
              </div>
              <div style={{ color: '#666', fontSize: '0.9em' }}>
                <strong>Disponivel: </strong> {formatOrganistAvailability(org.availability)}
              </div>
            </li>
          ))}
        </ul>
      )}
    </>
  );
};

OrganistList.propTypes = {
  loading: PropTypes.bool.isRequired,
  organists: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.string.isRequired,
      name: PropTypes.string.isRequired,
      availability: PropTypes.object,
    })
  ).isRequired,
  formatOrganistAvailability: PropTypes.func.isRequired,
  onStartEdit: PropTypes.func.isRequired,
  onRequestDeleteOrganist: PropTypes.func.isRequired,
};

export default OrganistList;
