import React, { useState } from "react";
import { Box, Button, Heading, Input, Select, Table, Thead, Tbody, Tr, Th, Td, Link, Text, Code } from "@chakra-ui/react";

const Index = () => {
  const [csvData, setCsvData] = useState([]);
  const [selectedProject, setSelectedProject] = useState("");

  const handleFileUpload = (event) => {
    const file = event.target.files[0];
    const reader = new FileReader();

    reader.onload = (e) => {
      const csvData = e.target.result;
      const results = csvData.split("\n").map((row) => row.split(","));
      const headers = results.shift();
      const data = results.map((row) => {
        return headers.reduce((obj, header, index) => {
          obj[header] = row[index];
          return obj;
        }, {});
      });
      setCsvData(data);
    };

    reader.readAsText(file);
  };

  const uniqueProjects = [...new Set(csvData.map((row) => row.__path__.split("/")[1]))];

  const filteredData = csvData.filter((row) => row.type === "ai_update").filter((row) => (selectedProject ? row.__path__.startsWith(`projects/${selectedProject}`) : true));

  return (
    <Box>
      <Heading mb={4}>Project Edit Viewer</Heading>

      <Input type="file" onChange={handleFileUpload} mb={4} />

      <Select placeholder="Select project" value={selectedProject} onChange={(e) => setSelectedProject(e.target.value)} mb={4}>
        {uniqueProjects.map((projectId) => (
          <option key={projectId} value={projectId}>
            {projectId}
          </option>
        ))}
      </Select>

      <Table>
        <Thead>
          <Tr>
            <Th>Edit ID</Th>
            <Th>Commit SHA</Th>
            <Th>GitHub Link</Th>
            <Th>Tag Output</Th>
          </Tr>
        </Thead>
        <Tbody>
          {filteredData.map((row) => (
            <Tr key={row.id}>
              <Td>{row.id}</Td>
              <Td>{row.commit_sha}</Td>
              <Td>
                {row.commit_sha && (
                  <Link href={`https://github.com/search?q=commit%3A+${row.commit_sha}&type=commits`} isExternal>
                    View Commit
                  </Link>
                )}
              </Td>
              <Td>
                <Code whiteSpace="pre">{row.tags?.coutput ? JSON.stringify(JSON.parse(row.tags.coutput), null, 2) : ""}</Code>
              </Td>
            </Tr>
          ))}
        </Tbody>
      </Table>

      {filteredData.length === 0 && <Text>No data to display</Text>}
    </Box>
  );
};

export default Index;
