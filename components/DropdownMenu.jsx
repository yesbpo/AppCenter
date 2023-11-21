import {Listbox, Transition} from "@headlessui/react";
import {CheckIcon, SelectorIcon} from "@heroicons/react/solid";
import React, {Fragment} from "react";

const DropdownMenu = ({elements, selected, setSelected}) => {

  return (
      <Listbox value={selected} onChange={setSelected}>
        <div className="relative">
          <Listbox.Button className=" w-[23rem] h-16 cursor-default rounded-md p-4 bg-[#e2e3e5] text-left shadow-md">
            <span className="block truncate">{selected.type}</span>
            <span className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-2">
              <SelectorIcon
                  className="h-5 w-5 text-gray-400"
                  aria-hidden="true"
              />
            </span>
          </Listbox.Button>
          <Transition
              as={Fragment}
              leave="transition ease-in duration-100"
              leaveFrom="opacity-100"
              leaveTo="opacity-0"
          >
            <Listbox.Options className="absolute mt-1 overflow-auto rounded-md bg-white py-1 text-base shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm">
              {elements.map((element, elementIndex) => (
                  <Listbox.Option
                      key={elementIndex}
                      className={({ active }) =>
                          `relative cursor-default select-none py-2 pl-10 pr-4 ${
                              active ? 'bg-amber-100 text-amber-900' : 'text-gray-900'
                          }`
                      }
                      value={element}
                  >
                    {({ selected }) => (
                        <>
                      <span
                          className={`block truncate ${
                              selected ? 'font-medium' : 'font-normal'
                          }`}
                      >
                        {element.type}
                      </span>
                          {selected ? (
                              <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-amber-600">
                          <CheckIcon className="h-5 w-5" aria-hidden="true" />
                        </span>
                          ) : null}
                        </>
                    )}
                  </Listbox.Option>
              ))}
            </Listbox.Options>
          </Transition>
        </div>
      </Listbox>
  )
}

export default DropdownMenu;