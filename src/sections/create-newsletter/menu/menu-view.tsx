import type { RootState } from 'src/store';
import type { TDrawers } from 'src/types/newsletter';

import { useEffect } from 'react';
import { useSelector } from 'react-redux';

import MenuLayout from './menu-layout';
import CropSection from './crop-section';
import AddTemplateMenu from './add-template/add-templates';

export default function MenuNeswletter() {
  const menu = useSelector((state: RootState) => state.newsletter.menuData.type);
  // const imageSaved = useSelector((state: RootState) => state.newsletter.imageSaved);

  // const dispatch = useDispatch();

  // const showPopup = useBoolean();

  // const Theme = useTheme();

  type TMenu = {
    name: TDrawers;
    title: string;
    Component: React.ReactNode;
  };

  const MenuList: TMenu[] = [
    {
      name: 'add-template',
      title: 'Selecciona el tipo de template',
      Component: <AddTemplateMenu />,
    },
    {
      name: 'crop-image',
      title: 'Multimedia',
      Component: <CropSection />,
    },
  ];

  const currentMenu: TMenu = MenuList.find((item) => item.name === menu) || MenuList[0];

  useEffect(() => {
    // if (menu === 'crop-image') {
    //   if (!imageSaved) {
    //     showPopup.onTrue();
    //   }
    // }
  }, [menu]);

  return (
    <>
      {/* {!showPopup.value ? ( */}
      <MenuLayout title={currentMenu?.title}>{currentMenu?.Component}</MenuLayout>
      {/* ) : (
        <Dialog
          fullWidth
          maxWidth="xs"
          open={showPopup.value}
          onClose={showPopup.onFalse}
          transitionDuration={{
            enter: Theme.transitions.duration.shortest,
            exit: Theme.transitions.duration.shortest - 80,
          }}
        >
          <DialogTitle
            sx={{ minHeight: 76 }}
            style={{
              padding: Theme.spacing(5),
            }}
          >
            <Stack direction="column" justifyContent="space-between">
              <Typography
                variant="h6"
                sx={{
                  textAlign: 'center',
                  width: '100%',
                  mb: Theme.spacing(5),
                }}
              >
                No has guardado los cambios realizados en la imagen
              </Typography>

              <Stack
                direction="row"
                spacing={1}
                sx={{
                  justifyContent: 'center',
                  width: '100%',
                }}
              >
                <Button
                  onClick={() => {
                    showPopup.onFalse();
                  }}
                  color="primary"
                  variant="outlined"
                  sx={{
                    '&.MuiButton-root': {
                      height: '48px',
                      padding: Theme.spacing(0, 7),
                      fontSize: { xs: '12px', md: '16px' },
                    },
                  }}
                >
                  Ok
                </Button>
              </Stack>
            </Stack>
          </DialogTitle>
        </Dialog>
      )} */}
    </>
  );
}
