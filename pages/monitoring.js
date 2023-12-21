import React, { useEffect, useState } from 'react';

const YourComponent = () => {
    const [templates, setTemplates] = useState([]);
    const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch('http://localhost:5000/gupshup-templates');

        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }

        const data = await response.json();

        if (data.status === "success") {
          const processedTemplates = data.templates.map(template => ({
            category: template.category,
            createdOn: template.createdOn,
            data: template.data,
            elementName: template.elementName,
            languageCode: template.languageCode,
            status: template.status,
            templateType: template.templateType,
          }));

          setTemplates(processedTemplates);
        } else {
          setError(`Error: ${data.message}`);
        }
      } catch (error) {
        setError(`Fetch error: ${error.message}`);
      }
    };

    fetchData();
  }, []);

  return (
    <div>
      {error && <p>{error}</p>}
      {templates.length > 0 && (
        <ul>
          {templates.map(template => (
            <li key={template.elementName}>
              <strong>Category:</strong> {template.category}<br />
              <strong>Created On:</strong> {new Date(template.createdOn).toLocaleString()}<br />
              <strong>Data:</strong> {template.data}<br />
              <strong>Element Name:</strong> {template.elementName}<br />
              <strong>Language Code:</strong> {template.languageCode}<br />
              <strong>Status:</strong> {template.status}<br />
              <strong>Template Type:</strong> {template.templateType}<br />
              <hr />
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default YourComponent;
