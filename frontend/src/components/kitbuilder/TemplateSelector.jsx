import React from 'react';
import './TemplateSelector.css';

const TemplateSelector = ({ templates, onApplyTemplate, onClose }) => {
  return (
    <div className="template-selector-overlay">
      <div className="template-selector">
        <div className="template-selector-header">
          <h3>Kit Templates</h3>
          <button
            className="close-btn"
            onClick={onClose}
          >
            ×
          </button>
        </div>

        <div className="template-list">
          {templates.map(template => (
            <div className="template-card" key={template.id}>
              <div className="template-info">
                <h4>{template.name}</h4>
                <p>{template.description}</p>
                <div className="template-meta">
                  <span className="template-stat">
                    {template.itemCount} items
                  </span>
                  <span className="template-stat">
                    ~${template.estimatedPrice}
                  </span>
                </div>
                <div className="template-categories">
                  {template.categories.map(category => (
                    <span className="category-tag" key={category}>
                      {category}
                    </span>
                  ))}
                </div>
              </div>
              <button
                className="btn btn-sm"
                onClick={() => onApplyTemplate(template.id)}
              >
                Apply Template
              </button>
            </div>
          ))}
        </div>

        <div className="template-selector-footer">
          <p>
            Templates are starting points. You can customize your kit after applying a template.
          </p>
          <button
            className="btn btn-outline"
            onClick={onClose}
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
};

export default TemplateSelector;