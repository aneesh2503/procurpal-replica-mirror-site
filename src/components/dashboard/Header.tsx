
import { useState } from "react";
import { Bell, Search, User } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { toast } from "@/hooks/use-toast";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

export function Header() {
  const [notifications, setNotifications] = useState([
    {
      id: 1,
      title: "New Quote Request",
      description: "ABC Corp submitted a new quote request",
      time: "5 minutes ago",
      read: false,
    },
    {
      id: 2,
      title: "Bid Approved",
      description: "Your bid for Project X was approved",
      time: "1 hour ago",
      read: false,
    },
    {
      id: 3,
      title: "Payment Received",
      description: "Payment received for Order #12345",
      time: "2 days ago",
      read: true,
    },
  ]);

  const unreadCount = notifications.filter((n) => !n.read).length;

  const markAsRead = (id: number) => {
    setNotifications(
      notifications.map((n) => (n.id === id ? { ...n, read: true } : n))
    );
  };

  const markAllAsRead = () => {
    setNotifications(notifications.map((n) => ({ ...n, read: true })));
  };

  const showNotificationToast = () => {
    toast({
      title: "Bid verification delayed",
      description: "Bid verification delayed for Rare Book Collection. Checking payment method.", 
      variant: "destructive"
    });
  };

  return (
    <header className="h-16 px-6 border-b border-gray-200 flex items-center justify-between bg-white">
      <div className="flex items-center gap-4 w-1/3">
        <div className="relative w-full max-w-md">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
          <input
            type="text"
            placeholder="Search..."
            className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-procurpal-primary/30 focus:border-procurpal-primary"
          />
        </div>
      </div>

      <div className="flex items-center gap-4">
        <Button 
          variant="outline" 
          className="border-dashed border-procurpal-primary text-procurpal-primary hover:bg-procurpal-primary/10"
          onClick={showNotificationToast}
        >
          Trigger Toast
        </Button>
        
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="relative" size="icon">
              <Bell size={20} />
              {unreadCount > 0 && (
                <Badge
                  className="absolute -top-1 -right-1 px-1.5 py-0.5 min-w-5 h-5 flex items-center justify-center bg-procurpal-danger text-white"
                  variant="destructive"
                >
                  {unreadCount}
                </Badge>
              )}
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-80">
            <DropdownMenuLabel className="flex items-center justify-between">
              <span>Notifications</span>
              {unreadCount > 0 && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={markAllAsRead}
                  className="text-xs text-procurpal-primary hover:text-procurpal-primary"
                >
                  Mark all as read
                </Button>
              )}
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            {notifications.length === 0 ? (
              <div className="py-4 text-center text-muted-foreground">
                No notifications
              </div>
            ) : (
              notifications.map((notification) => (
                <DropdownMenuItem
                  key={notification.id}
                  className="flex flex-col items-start p-3 cursor-default"
                  onSelect={() => markAsRead(notification.id)}
                >
                  <div className="flex items-start gap-2 w-full">
                    <div
                      className={`w-2 h-2 rounded-full mt-1.5 ${
                        notification.read ? "bg-gray-300" : "bg-procurpal-primary"
                      }`}
                    />
                    <div className="flex-1">
                      <div className="font-medium">{notification.title}</div>
                      <div className="text-sm text-muted-foreground">
                        {notification.description}
                      </div>
                      <div className="text-xs text-muted-foreground mt-1">
                        {notification.time}
                      </div>
                    </div>
                  </div>
                </DropdownMenuItem>
              ))
            )}
            <DropdownMenuSeparator />
            <DropdownMenuItem className="justify-center">
              <span className="text-sm text-procurpal-primary">View all notifications</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="ghost"
              className="relative flex items-center gap-2"
            >
              <Avatar className="h-8 w-8">
                <AvatarImage src="" />
                <AvatarFallback>JD</AvatarFallback>
              </Avatar>
              <div className="hidden md:block text-left">
                <p className="text-sm font-medium">John Doe</p>
                <p className="text-xs text-muted-foreground">Admin</p>
              </div>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuLabel>My Account</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem>Profile</DropdownMenuItem>
            <DropdownMenuItem>Billing</DropdownMenuItem>
            <DropdownMenuItem>Settings</DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem>Logout</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
}
