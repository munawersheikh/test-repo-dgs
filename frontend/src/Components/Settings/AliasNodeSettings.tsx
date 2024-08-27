import React, { useEffect, useState } from 'react';
import { Select, Button, Input, message, Typography } from 'antd';
import { fetchNodes, updateNode } from '../../Services'; // Adjust the import path as needed

const { Option } = Select;
const { Title, Text } = Typography;

const AliasNodeSettings = () => {
  const [aliasNode, setAliasNode] = useState<string>('');
  const [options, setOptions] = useState<any[]>([]);
  const [currentOption, setCurrentOption] = useState<any>(null);
  const [editedOption, setEditedOption] = useState<string>('');
  const [isAliasModified, setIsAliasModified] = useState<boolean>(false);

  useEffect(() => {
    const fetchData = async () => {
      const nodes = await fetchNodes();
      setOptions(nodes);
      localStorage.setItem('nodes', JSON.stringify(nodes)); // Save API response in local storage
    };

    fetchData();
  }, []);

  const handleAliasNodeChange = (value: string) => {
    const selectedOption = options.find(option => option.name === value);
    setAliasNode(value);
    setCurrentOption(selectedOption);
    setEditedOption(selectedOption.alias || '');
    setIsAliasModified(false); // Reset modification status on node change
  };

  const handleAliasInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEditedOption(e.target.value);
    setIsAliasModified(true); // Set to true only when the input changes
  };

  const handleSave = async () => {
    if (currentOption) {
      const response = await updateNode(currentOption.id, editedOption);
      if (response) {
       
        
        const updatedOptions = options.map(option =>
          option.id === currentOption.id ? { ...option, alias: editedOption } : { ...option, alias: option.name }
        );
        setOptions(updatedOptions);

        // Show success message at the center of the screen
        message.config({
          top: window.innerHeight / 2 - 50, // Adjust the number to control vertical positioning
          duration: 3,
        });
        message.success("Node updated successfully.");

        setIsAliasModified(false);

        // Update local storage
        const storedNodes = JSON.parse(localStorage.getItem('nodes') || '[]');
       
        
        const updatedNodes = storedNodes.map((node: any) =>
          node.name === currentOption.name ? { ...node, alias: editedOption } : { ...node, alias: node.name }
        );
        localStorage.setItem('nodes', JSON.stringify(updatedNodes));
      } else {
        message.error('Failed to update node.');
      }
    }
  };

  return (
    <div>
      <Title style={{ textAlign: "left", fontSize: 25 }}>Alias Nodes Settings</Title>
      <div style={{ marginBottom: 16 }}>
        <Text style={{ color: '#fff' }}>Node Name</Text>
        <Select
          value={aliasNode}
          onChange={handleAliasNodeChange}
          placeholder="Select Node"
          style={{ width: 250, marginLeft: "20px" }}
          dropdownStyle={{ backgroundColor: '#1f1f1f' }}
        >
          {options.map(option => (
            <Option key={option.id} value={option.name}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span>{option.name}</span>
              </div>
            </Option>
          ))}
        </Select>
      </div>
      {currentOption && (
        <div style={{ marginBottom: 16 }}>
          <Text style={{ color: '#fff' }}>Alias Name</Text>
          <Input
            value={editedOption}
            onChange={handleAliasInputChange}
            placeholder={currentOption.alias === null ? "Not Assigned" : "Edit Alias"}
            style={{ marginLeft: "25px", width: 250 }}
          />
        </div>
      )}
   
      <Button
        onClick={handleSave}
        style={{ width: 250 }}
        // Enable button only if alias is modified and alias name is not empty
        // disabled={!isAliasModified || editedOption.trim() === ''}
      >
        Save
      </Button>
    </div>
  );
};

export default AliasNodeSettings;
