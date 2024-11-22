import { useEffect, useState } from "react";
import "../App.css";
import axios from "axios";
import {
  Card,
  CardBody,
  Divider,
  Heading,
  Image,
  Stack,
  Text,
} from "@chakra-ui/react";

function Project() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    axios
      .get("https://api.github.com/users/facebook/repos")
      .then((response) => {
        setData(response.data);
        setLoading(false);
      })
      .catch((e) => {
        setError(e.message);
        setLoading(false);
      });
  }, []);

  if (loading) {
    return <span>Loading . . .</span>;
  }

  if (error) {
    return <span>{error}</span>;
  }

  return (
    <div className="project">
      <h1>This is the Project page FB </h1>
      <div>
        Lorem ipsum dolor sit amet consectetur, adipisicing elit. Totam magnam
        aut excepturi non sapiente laborum, ullam assumenda illum facilis nihil
        cupiditate enim repellendus? Cupiditate, ipsa eaque. Pariatur
        exercitationem deserunt ex!
      </div>
      <div className="project-item">
        {data.map((project, index) => {
          return (
            <Card maxW="sm" key={index}>
              <CardBody>
                <Image
                  src="https://picsum.photos/300?grayscale"
                  alt="Green double couch with wooden legs"
                  borderRadius="lg"
                />
                <Stack mt="6" spacing="3">
                  <Heading size="md">{project.name}</Heading>
                  <Text>{project.description}</Text>
                </Stack>
              </CardBody>
              <Divider />
            </Card>
          );
        })}
      </div>
    </div>
  );
}
export default Project;
