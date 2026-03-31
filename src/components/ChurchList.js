import React from 'react';
import PropTypes from 'prop-types';
import Button from './ui/Button';

const ChurchList = ({
  churches,
  isLoading,
  hasLoadError = false,
  onChurchSelect,
  onStartEdit,
  onRequestDeleteChurch,
}) => {
  return (
    <>
      <h3>Igrejas Cadastradas:</h3>
      {!isLoading && !hasLoadError && churches.length === 0 ? (
        <p>Nenhuma igreja cadastrada.</p>
      ) : (
        <ul className="list-reset">
          {churches.map((church) => (
            <li
              key={church.id}
              onClick={() => onChurchSelect(church)}
              className="church-list__item"
            >
              <div className="church-list__content">
                <div className="church-list__header">
                  <strong className="church-list__name">{church.name}</strong>
                  {church.operationalSummary && (
                    <div className="church-list__status-block">
                      <span
                        className={`church-list__status church-list__status--${church.operationalSummary.readiness.tone}`}
                      >
                        {church.operationalSummary.readiness.label}
                      </span>
                      <span className="church-list__status-detail">
                        {church.operationalSummary.readiness.detail}
                      </span>
                    </div>
                  )}
                </div>
                {church.code && <small className="muted-text">Código: {church.code}</small>}
                {church.operationalSummary && (
                  <div className="church-list__summary">
                    <span className="church-list__summary-item">
                      <strong>Modelo:</strong> {church.operationalSummary.cultoModelLabel}
                    </span>
                    <span className="church-list__summary-item">
                      <strong>Organistas:</strong> {church.operationalSummary.organistCount}
                    </span>
                    <span className="church-list__summary-item">
                      <strong>Escalas:</strong> {church.operationalSummary.scheduleCount}
                    </span>
                  </div>
                )}
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
      )}
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
      operationalSummary: PropTypes.shape({
        cultoModelLabel: PropTypes.string.isRequired,
        organistCount: PropTypes.number.isRequired,
        scheduleCount: PropTypes.number.isRequired,
        readiness: PropTypes.shape({
          label: PropTypes.string.isRequired,
          tone: PropTypes.string.isRequired,
          detail: PropTypes.string.isRequired,
        }).isRequired,
      }),
    })
  ).isRequired,
  isLoading: PropTypes.bool.isRequired,
  hasLoadError: PropTypes.bool,
  onChurchSelect: PropTypes.func.isRequired,
  onStartEdit: PropTypes.func.isRequired,
  onRequestDeleteChurch: PropTypes.func.isRequired,
};

export default ChurchList;
