import Box from "@mui/joy/Box";
import Card from "@mui/joy/Card";
import CardContent from "@mui/joy/CardContent";
import Typography from "@mui/joy/Typography";
import { IMessage } from "../../../../../typesUI.ts";
import React, { useRef } from "react";
import { useAppSelector } from "../../../../../app/hooks.ts";
import { selectUser } from "../../../../users/usersSlice.ts";
import AccessTimeIcon from "@mui/icons-material/AccessTime";
import dayjs from "dayjs";
import CalendarMonthIcon from "@mui/icons-material/CalendarMonth";
import { Button } from "@mui/material";

interface Props {
  message: IMessage;
}

const Message: React.FC<Props> = ({ message }) => {
  const user = useAppSelector(selectUser);
  const ws = useRef<WebSocket | null>(null);
  ws.current = new WebSocket("ws://localhost:8000/chat");

  const onDelete = (id: string) => {
    if (!ws.current) return;
    const deleteMessage = {
      type: "DELETE_MESSAGE",
      payload: id,
    };
    ws.current.send(JSON.stringify(deleteMessage));
  };

  return (
    <>
      {user && message.user && user.username === message.user.username ? (
        <Box
          sx={{
            marginBottom: "20px",
            width: "45%",
            marginLeft: "auto",
            marginRight: "10px",
            gridTemplateColumns: "repeat(auto-fill, minmax(240px, 1fr))",
          }}
        >
          <Card variant="outlined">
            <CardContent>
              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  marginBottom: "10px",
                  flexWrap: "wrap",
                }}
              >
                <Box sx={{ display: "flex", alignItems: "center" }}>
                  <CalendarMonthIcon fontSize={"small"} />
                  <Typography
                    noWrap
                    sx={{
                      letterSpacing: -0.25,
                      color: "text.secondary",
                      fontSize: 15,
                      marginLeft: "8px",
                    }}
                  >
                    {dayjs(message.datetime).format("DD.MM.YYYY")}
                  </Typography>
                </Box>
                <Box
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    marginLeft: "10px",
                  }}
                >
                  <AccessTimeIcon fontSize={"small"} />
                  <Typography
                    noWrap
                    sx={{
                      letterSpacing: -0.25,
                      color: "text.secondary",
                      fontSize: 15,
                      marginLeft: "8px",
                    }}
                  >
                    {dayjs(message.datetime).format(" HH:mm")}
                  </Typography>
                </Box>
              </Box>
              <Box>
                <Typography level="title-md">
                  <b>{message.user.username}:</b>
                </Typography>
                <Typography>{message.message}</Typography>
                {user?.role === "moderator" && (
                  <>
                    <Button
                      style={{ display: "block", marginLeft: "auto" }}
                      onClick={() => onDelete(message._id)}
                    >
                      Delete
                    </Button>
                  </>
                )}
              </Box>
            </CardContent>
          </Card>
        </Box>
      ) : (
        <Box
          sx={{
            width: "45%",
            marginBottom: "20px",
            gridTemplateColumns: "repeat(auto-fill, minmax(240px, 1fr))",
          }}
        >
          <Card variant="soft">
            <CardContent>
              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  marginBottom: "10px",
                  flexWrap: "wrap",
                }}
              >
                <Box sx={{ display: "flex", alignItems: "center" }}>
                  <CalendarMonthIcon fontSize={"small"} />
                  <Typography
                    noWrap
                    sx={{
                      letterSpacing: -0.25,
                      color: "text.secondary",
                      fontSize: 15,
                      marginLeft: "8px",
                    }}
                  >
                    {dayjs(message.datetime).format("DD.MM.YYYY")}
                  </Typography>
                </Box>
                <Box
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    marginLeft: "10px",
                  }}
                >
                  <AccessTimeIcon fontSize={"small"} />
                  <Typography
                    noWrap
                    sx={{
                      letterSpacing: -0.25,
                      color: "text.secondary",
                      fontSize: 15,
                      marginLeft: "8px",
                    }}
                  >
                    {dayjs(message.datetime).format(" HH:mm")}
                  </Typography>
                </Box>
              </Box>
              <Typography level="title-md">{message.user?.username}</Typography>
              <Typography>{message.message}</Typography>
              {user?.role === "moderator" && (
                <>
                  <Button
                    style={{ display: "block", marginLeft: "auto" }}
                    onClick={() => onDelete(message._id)}
                  >
                    Delete
                  </Button>
                </>
              )}
            </CardContent>
          </Card>
        </Box>
      )}
    </>
  );
};

export default Message;
