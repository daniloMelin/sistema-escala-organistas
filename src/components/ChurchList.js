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
      <ul className="list-reset">
        {churches.map((church) => (
          <li
            key={church.id}
            onClick={() => onChurchSelect(church)}
            className="church-list__item"
          >
            <div>
              <strong className="church-list__name">{church.name}</strong>
              <br />
              {church.code && <small className="muted-text">Código: {church.code}</small>}
            </div>
            <div className="actions-row">
              <Button
                onClick={(e) => onStartEdit(e, church)}
                disabled={isLoading}
                variant="warning"
                size="sm"
              >
                Editar
              </Button>
              <Button
                onClick={(e) => onRequestDeleteChurch(e, church.id, church.name)}
                disabled={isLoading}
                variant="danger"
                size="sm"
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
