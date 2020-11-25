import {
  Divider,
  Drawer,
  IconButton,
  List,
  ListItem,
  ListItemText,
  Typography,
} from "@material-ui/core";
import React, { useMemo, useContext } from "react";
import { ArrowBackRounded } from "@material-ui/icons";
import categories from "../../Data/productCategoriesArr.json";
import DrawerContext from "../../Context/Drawer";

const CategoriesDrawer: React.FC = () => {
  const { drawerState, setDrawerState } = useContext(DrawerContext)!;

  const mainCatDrawer = useMemo(
    () => (
      <div>
        <Typography
          variant="subtitle1"
          gutterBottom
          style={{ marginTop: "10px", textAlign: "center" }}
        >
          All Categories
        </Typography>
        <Divider />
        <List>
          {categories.map(({ category }, id) => (
            <ListItem key={id} button onClick={() => setDrawerState(id)}>
              <ListItemText primary={category} />
            </ListItem>
          ))}
        </List>
      </div>
    ),
    [setDrawerState]
  );

  const subCatDrawers = useMemo(
    () =>
      categories.map(({ category, subCategories }, id) => (
        <div key={id}>
          <IconButton onClick={() => setDrawerState(-1)}>
            <ArrowBackRounded />
          </IconButton>
          <Typography
            variant="subtitle1"
            gutterBottom
            style={{
              textAlign: "center",
              paddingLeft: "20px",
              paddingRight: "20px",
            }}
            color="textSecondary"
          >
            {category}
          </Typography>
          <Divider />
          <List>
            {subCategories.map((subCat) => (
              <ListItem
                key={subCat.id}
                button
                onClick={() => {
                  setDrawerState(null);
                }}
              >
                <ListItemText primary={subCat.name} />
              </ListItem>
            ))}
          </List>
        </div>
      )),
    [setDrawerState]
  );

  return (
    <Drawer
      anchor="left"
      open={drawerState !== null}
      onClose={() => setDrawerState(null)}
    >
      {drawerState === -1
        ? mainCatDrawer
        : drawerState !== null && subCatDrawers[drawerState]}
    </Drawer>
  );
};

export default CategoriesDrawer;
