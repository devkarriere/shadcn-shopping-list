import { useEffect, useRef, useState } from "react";
import { Button } from "./components/ui/button";
import { Input } from "./components/ui/input";
import { useToast } from "./hooks/use-toast";
import { CheckCircledIcon, ResetIcon, TrashIcon } from "@radix-ui/react-icons";

type Product = {
  name: string;
  quantity: number;
  bought: boolean;
};

const LOCAL_STORAGE_KEY = "einkaufsliste";

export default function App() {
  const [count, setCount] = useState(1);
  const [product, setProduct] = useState("");
  const [list, setList] = useState<Product[]>([]);

  const dataLoaded = useRef(false);

  const { toast } = useToast();

  useEffect(() => {
    setList(JSON.parse(localStorage.getItem(LOCAL_STORAGE_KEY) || "[]"));
    dataLoaded.current = true;
  }, []);

  useEffect(() => {
    if (dataLoaded.current) {
      localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(list));
    }
  }, [list]);

  return (
    <div className="w-full max-w-lg flex flex-col items-center justify-center px-4 mx-auto">
      <h1 className="text-3xl font-semibold mt-16 mb-10">Einkaufsliste</h1>
      <div className="flex w-full gap-2">
        <Input
          placeholder="Produkt eingeben..."
          value={product}
          onChange={(e) => setProduct(e.target.value)}
        />
        <Input
          type="number"
          className="max-w-10"
          value={count}
          onChange={(e) => setCount(Number(e.target.value))}
        />
      </div>
      <Button
        type="submit"
        size={"lg"}
        className="w-full mt-2"
        disabled={product.length < 1}
        onClick={() => {
          if (list.find((item) => item.name === product)) {
            toast({
              title: "Hinzufügen fehlgeschlagen",
              description:
                "Das Produkt ist bereits in der Einkaufsliste vorhanden.",
              variant: "destructive",
            });
          } else {
            setList([
              { name: product, quantity: count, bought: false },
              ...list,
            ]);
            setCount(1);
            setProduct("");
          }
        }}
      >
        Eintrag Hinzufügen
      </Button>
      <div className="flex flex-col w-full gap-2 mt-6">
        {list
          .sort((item) => (item.bought ? 1 : -1))
          .map((item) => (
            <div className="rounded-xl border bg-card text-card-foreground shadow p-6 flex justify-between items-center">
              <div>
                <h3
                  className={`text-lg font-semibold${
                    item.bought ? " text-muted-foreground line-through" : ""
                  }`}
                >
                  {item.name}
                </h3>
                <p className="text-sm text-muted-foreground">
                  Anzahl: {item.quantity}
                </p>
              </div>
              <div className="flex gap-2">
                {item.bought && (
                  <Button
                    variant="destructive"
                    size={"icon"}
                    onClick={() => {
                      setList([
                        ...list.filter(
                          (listItem) => listItem.name !== item.name
                        ),
                      ]);
                      toast({
                        description:
                          item.name + " wurde aus der Einkaufsliste entfernt.",
                        title: "Produkt gelöscht",
                      });
                    }}
                  >
                    <TrashIcon className="w-4 h-4" />
                  </Button>
                )}
                <Button
                  onClick={() => {
                    setList([
                      ...list.filter((listItem) => listItem.name !== item.name),
                      {
                        name: item.name,
                        quantity: item.quantity,
                        bought: !item.bought,
                      },
                    ]);
                  }}
                  variant={!item.bought ? "outline" : "secondary"}
                  size={!item.bought ? "lg" : "default"}
                >
                  {!item.bought ? <CheckCircledIcon /> : <ResetIcon />}
                  {!item.bought ? "Abhaken" : "Zurück"}
                </Button>
              </div>
            </div>
          ))}
      </div>
    </div>
  );
}
