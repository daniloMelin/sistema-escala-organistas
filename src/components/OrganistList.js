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
        <ul className="list-reset">
          {organists.map((org) => (
            <li key={org.id} className="organist-list__item">
              <div className="organist-list__header">
                <div>
                  <strong className="organist-list__name">{org.name}</strong>
                </div>

                <div className="actions-row">
                  <Button onClick={() => onStartEdit(org)} variant="warning" size="sm">
                    Editar
                  </Button>
                  <Button
                    onClick={() => onRequestDeleteOrganist(org.id, org.name)}
                    variant="danger"
                    size="sm"
                  >
                    Excluir
                  </Button>
                </div>
              </div>
              <div className="muted-text muted-text--sm">
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
