import { useEffect, useMemo, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Phone, Search, Loader2 } from "lucide-react";
import { getAuth } from "firebase/auth";
import { useToast } from "@/components/ui/use-toast";

interface Props {
  open: boolean;
  onClose: () => void;
}

interface Contact {
  name: string;
  phone: string;
  amount?: number;
  type: "tenant" | "caretaker";
  plotName: string;
}

const formatKenyanMobile = (value: string) => {
  const digits = value.replace(/\D/g, "").slice(0, 12);

  if (digits.startsWith("254") && digits.length === 12) {
    return { value: digits, isValid: true };
  }

  if (digits.startsWith("07") || digits.startsWith("01")) {
    if (digits.length < 10) return { value: digits, isValid: true };
    return { value: `254${digits.slice(1)}`, isValid: true };
  }

  if (digits.length === 0) return { value: "", isValid: true };

  return { value: digits, isValid: false };
};

export function StkPushModal({ open, onClose }: Props) {
  const { toast } = useToast();

  const [rawPhone, setRawPhone] = useState("");
  const [phone, setPhone] = useState("");
  const [phoneValid, setPhoneValid] = useState(true);
  const [amount, setAmount] = useState("");
  const [loading, setLoading] = useState(false);

  const [contacts, setContacts] = useState<Contact[]>([]);
  const [search, setSearch] = useState("");
  const [selectedContact, setSelectedContact] = useState<Contact | null>(null);

  /* ---------------- FETCH PLOTS ---------------- */
  useEffect(() => {
    if (!open) return;

    const fetchPlots = async () => {
      const auth = getAuth();
      const user = auth.currentUser;
      if (!user) return;

      const token = await user.getIdToken();
      const res = await fetch(
        `${import.meta.env.VITE_API_BASE_URL}/api/plots/getplots`,
        { headers: { Authorization: `Bearer ${token}` } }
      );

      const data = await res.json();
      if (!res.ok) return;

      const derived: Contact[] = [];

      data.plots.forEach((plot: any) => {
        if (plot.caretakerName && plot.caretakerPhone) {
          derived.push({
            name: plot.caretakerName,
            phone: plot.caretakerPhone,
            type: "caretaker",
            plotName: plot.name,
          });
        }

        if (plot.plotType === "individual") {
          plot.tenants?.forEach((t: any) => {
            derived.push({
              name: t.name,
              phone: t.phone,
              amount: Number(plot.feePerTenant || 0),
              type: "tenant",
              plotName: plot.name,
            });
          });
        }

        if (plot.plotType === "lumpsum" && plot.lumpsumExpected) {
          derived.push({
            name: plot.name,
            phone: plot.mpesaNumber || "",
            amount: Number(plot.lumpsumExpected),
            type: "tenant",
            plotName: plot.name,
          });
        }
      });

      setContacts(derived);
    };

    fetchPlots();
  }, [open]);

  /* ---------------- FILTER CONTACTS ---------------- */
  const filteredContacts = useMemo(() => {
    const q = search.toLowerCase();
    return contacts.filter(
      (c) =>
        c.name.toLowerCase().includes(q) ||
        c.phone.includes(q) ||
        c.plotName.toLowerCase().includes(q)
    );
  }, [contacts, search]);

  /* ---------------- PHONE CHANGE ---------------- */
  const handlePhoneChange = (value: string) => {
    setRawPhone(value);
    const { value: formatted, isValid } = formatKenyanMobile(value);
    setPhone(formatted);
    setPhoneValid(isValid);
  };

  /* ---------------- SELECT CONTACT ---------------- */
  const selectContact = (c: Contact) => {
    setSelectedContact(c);
    handlePhoneChange(c.phone);
    if (c.amount) setAmount(String(c.amount));
  };

  /* ---------------- SUBMIT STK ---------------- */
  const submitStk = async () => {
    // ---------------- REQUIRED FIELDS ----------------
    if (!rawPhone || !amount) {
      toast({
        title: "Missing Information",
        description: "Phone number and amount are required",
        className:
          "border-amber-500 bg-amber-50 text-amber-900 dark:bg-amber-950 dark:text-amber-200",
      });
      return;
    }

    // ---------------- PHONE VALIDATION ----------------
    if (!phoneValid) {
      toast({
        title: "Invalid Phone Number",
        description: "Use 07XXXXXXXX or 01XXXXXXXX format",
        className:
          "border-amber-500 bg-amber-50 text-amber-900 dark:bg-amber-950 dark:text-amber-200",
      });
      return;
    }

    setLoading(true);

    try {
      const res = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/stk`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          phone,
          amount: Number(amount),
        }),
      });

      const data = await res.json();

      // ---------------- BACKEND ERROR ----------------
      if (!res.ok) {
        toast({
          variant: "destructive",
          title: "STK Push Failed",
          description: data?.error || "Unable to send STK push",
          className:
            "border-red-500 bg-red-50 text-red-900 dark:bg-red-950 dark:text-red-200",
        });
        return;
      }

      // ---------------- SUCCESS ----------------
      toast({
        title: "STK Push Sent",
        description: "Prompt successfully sent to the phone",
        className:
          "border-green-500 bg-green-50 text-green-900 dark:bg-green-950 dark:text-green-200",
      });

      onClose();
      setRawPhone("");
      setAmount("");
    } catch (error) {
      // ---------------- NETWORK ERROR ----------------
      toast({
        title: "Network Error",
        description: "Could not reach payment server",
        className:
          "border-red-500 bg-red-50 text-red-900 dark:bg-red-950 dark:text-red-200",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-lg w-full">
        <DialogHeader>
          <DialogTitle>Send STK Push</DialogTitle>
        </DialogHeader>

        <Tabs defaultValue="external">
          <TabsList className="grid grid-cols-2">
            <TabsTrigger value="external">External</TabsTrigger>
            <TabsTrigger value="internal">Tenant / Caretaker</TabsTrigger>
          </TabsList>

          <TabsContent value="external" className="space-y-4">
            <div className="relative">
              <Input
                placeholder="0712345678"
                value={rawPhone}
                onChange={(e) => handlePhoneChange(e.target.value)}
                required
              />
              {!phoneValid && (
                <span className="absolute mt-1 text-xs text-amber-600">
                  Must start with <strong>07</strong> or <strong>01</strong> and
                  have <strong>10 digits</strong>
                </span>
              )}
            </div>
            <Input
              placeholder="Amount"
              type="number"
              value={amount}
              required
              onChange={(e) => setAmount(e.target.value)}
            />
          </TabsContent>

          <TabsContent value="internal" className="space-y-4">
            <div className="relative">
              <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search tenant, caretaker or plot"
                className="pl-10"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>

            <div className="max-h-60 overflow-y-auto border rounded-md">
              {filteredContacts.map((c, i) => (
                <div
                  key={i}
                  className="flex items-center justify-between px-3 py-2 hover:bg-muted cursor-pointer"
                  onClick={() => selectContact(c)}
                >
                  <div>
                    <div className="font-medium">{c.name}</div>
                    <div className="text-sm text-muted-foreground">
                      {c.phone} · {c.plotName}
                    </div>
                  </div>
                  <Badge variant="outline">{c.type}</Badge>
                </div>
              ))}
            </div>

            {selectedContact && (
              <Badge variant="secondary">
                Selected: {selectedContact.name}
              </Badge>
            )}
          </TabsContent>
        </Tabs>

        <div className="flex justify-end gap-2 pt-4">
          <Button variant="outline" onClick={onClose} disabled={loading}>
            Cancel
          </Button>
          <Button onClick={submitStk} disabled={loading || !phoneValid}>
            {loading ? (
              <Loader2 className="h-4 w-4 mr-2 animate-spin" />
            ) : (
              <Phone className="h-4 w-4 mr-2" />
            )}
            Send STK
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
