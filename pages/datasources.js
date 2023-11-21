import React from 'react';
import Layout from "../components/Layout";
import CreateDataSourceModal from "../components/Datasources/CreateDataSourceModal";

const Datasources = (props) => {
  return (
      <Layout>
          <div className="fixed inset-0 flex items-center justify-center bg-text bg-opacity-50 backdrop-blur-sm">
              <CreateDataSourceModal
              />
          </div>
      </Layout>
  );
};

export default Datasources;