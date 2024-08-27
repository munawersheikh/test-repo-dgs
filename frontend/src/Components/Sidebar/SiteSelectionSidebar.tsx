import { Checkbox, Radio } from 'antd';
import React, { useState, useEffect } from 'react';

const SiteSelectionSidebar = () => {
  const [selectedSite, setSelectedSite] = useState<string | null>(null);
  const [onSiteSelectionNodes, setOnSiteSelectionNodes] = useState<string[]>([]);
  const [selectedNodes, setSelectedNodes] = useState<string[]>([]);
  const [nodeAliases, setNodeAliases] = useState<any[]>([]); // State to store node aliases from local storage

  useEffect(() => {
    // Fetch node aliases from local storage
    const storedNodes = JSON.parse(localStorage.getItem('nodes') || '[]');
    setNodeAliases(storedNodes);
  }, []);

 
  const dummySitesAndNodes = [
    {
      siteName: "Memphis"
      // Nodes are removed from here since we will use aliases from local storage
    }
  ];

  const onSiteSelection = (site: string) => {
    if (site === "Memphis") {
      // Filter nodes to include those with aliases or fallback to name in local storage related to Memphis site
      const nodesWithAliases = nodeAliases
        .filter((aliasNode: any) => aliasNode.siteId === 1) // Assuming siteId 1 corresponds to "Memphis"
        .map((aliasNode: any) => aliasNode.alias.trim() !== '' ? aliasNode.alias : aliasNode.name) // Use alias if available, otherwise fallback to name
        .filter(Boolean); // Remove any empty strings
 
      setOnSiteSelectionNodes(nodesWithAliases);
      setSelectedSite(site);
      setSelectedNodes([]);
    }
  };

  return (
    <div className='w-full flex items-center flex-col p-5'>
      <h1 className='custom-title text-center'>Site Selection</h1>
      <hr className='mb-3 border border-[#2f2f2f] w-full' />
      <Radio.Group className='w-full' value={selectedSite} onChange={(e) => onSiteSelection(e.target.value)}>
        {dummySitesAndNodes.map((site) => (
          <div key={site.siteName}>
            <Radio value={site.siteName}>{site.siteName}</Radio>
            {selectedSite === site.siteName && (
              <Checkbox.Group className='flex flex-col gap-1 px-6 py-2' value={selectedNodes} onChange={(values) => setSelectedNodes(values)}>
                {onSiteSelectionNodes.map((node) => (
                  <Checkbox key={node} value={node}>{node}</Checkbox>
                ))}
              </Checkbox.Group>
            )}
          </div>
        ))}
      </Radio.Group>
    </div>
  );
}

export default SiteSelectionSidebar;
